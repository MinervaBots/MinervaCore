import React, { useState } from 'react';
import { getFolders, getFiles } from '../../utils/githubApi';
import { Icons, RawIcons } from '../Icons';

export default function LinkPicker({ userToken, onSelect, onClose }) {
    const [step, setStep] = useState(1);
    const [area, setArea] = useState('');
    const [folder, setFolder] = useState('');
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Carrega pastas da área selecionada
    const loadFolders = async (selectedArea) => {
        setLoading(true);
        const targetArea = selectedArea || area; 
        setArea(targetArea);
        
        try {
            const items = await getFolders(`minervacore/docs/${targetArea}`, userToken);
            setList(items.map(i => ({ name: i.name, type: 'folder' })));
            setStep(2);
        } catch (e) {
            console.error(e);
            alert("Erro ao ler pastas.");
        } finally {
            setLoading(false);
        }
    };

    // Carrega arquivos da pasta selecionada
    const loadFiles = async (selectedFolder) => {
        setLoading(true);
        setFolder(selectedFolder);
        try {
            const items = await getFiles(`minervacore/docs/${area}/${selectedFolder}`, userToken);
            setList(items.map(i => ({ name: i.name, type: 'file' })));
            setStep(3);
        } catch (e) {
            console.error(e);
            alert("Erro ao ler arquivos.");
        } finally {
            setLoading(false);
        }
    };

    // Lógica do Botão Voltar
    const handleBack = () => {
        if (step === 3) {
            loadFolders(area); 
        } else if (step === 2) {
            setStep(1);
            setList([]);
        }
    };

    const handleFileSelect = (fileName) => {
        const cleanName = fileName.replace(/\.md$/, '');
        const finalLink = `/docs/${area}/${folder}/${cleanName}`;
        onSelect(finalLink);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div className="card padding--md" style={{width: '500px', maxHeight: '80vh', display: 'flex', flexDirection: 'column'}}>
                
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center', borderBottom:'1px solid var(--ifm-color-emphasis-200)', paddingBottom:'10px'}}>
                    <h3 style={{margin:0, fontSize:'1.1rem'}}>
                        {step === 1 ? 'Selecione a Área' : step === 2 ? `Pastas em ${area}` : `Arquivos em ${folder}`}
                    </h3>
                    <button className="button button--sm button--link" style={{color:'var(--ifm-color-emphasis-700)'}} onClick={onClose}>
                        {Icons.close}
                    </button>
                </div>

                {step > 1 && (
                    <button className="button button--secondary button--sm button--outline" style={{alignSelf: 'flex-start', marginBottom: '10px', display:'flex', gap:'5px', alignItems:'center'}} onClick={handleBack}>
                        {Icons.back} Voltar
                    </button>
                )}

                <div style={{overflowY: 'auto', flex: 1, border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '4px', backgroundColor: 'var(--ifm-background-surface-color)'}}>
                    {loading ? <div className="padding--md text--center">Carregando...</div> : (
                        <ul className="menu__list" style={{padding: '5px'}}>
                            {/* ÁREAS */}
                            {step === 1 && ['programacao', 'arquitetura', 'eletronica'].map(a => (
                                <li key={a} className="menu__list-item" onClick={() => loadFolders(a)}>
                                    <a className="menu__link" style={{cursor: 'pointer', textTransform: 'capitalize', display:'flex', gap:'10px', alignItems:'center'}}>
                                        {Icons.folder} {a}
                                    </a>
                                </li>
                            ))}

                            {/* LISTA */}
                            {step > 1 && list.map(item => (
                                <li key={item.name} className="menu__list-item" onClick={() => item.type === 'folder' ? loadFiles(item.name) : handleFileSelect(item.name)}>
                                    <a className="menu__link" style={{cursor: 'pointer', display:'flex', gap:'10px', alignItems:'center'}}>
                                        {item.type === 'folder' ? Icons.folder : Icons.file} {item.name}
                                    </a>
                                </li>
                            ))}
                            
                            {step > 1 && list.length === 0 && <li className="padding--md text--center opacity-50">Pasta vazia.</li>}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}