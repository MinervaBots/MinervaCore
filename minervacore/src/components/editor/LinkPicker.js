import React, { useState, useEffect } from 'react';
import { getFolders, getFiles } from '../../utils/githubApi';

export default function LinkPicker({ userToken, onSelect, onClose }) {
    const [step, setStep] = useState(1); // 1: Area, 2: Pasta, 3: Arquivo
    const [area, setArea] = useState('');
    const [folder, setFolder] = useState('');
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Carrega pastas da área selecionada
    const loadFolders = async (selectedArea) => {
        setLoading(true);
        setArea(selectedArea);
        try {
            const items = await getFolders(`minervacore/docs/${selectedArea}`, userToken);
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

    // Gera o link final e devolve
    const handleFileSelect = (fileName) => {
        // Remove a extensão .md para o link ficar limpo
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
                
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center'}}>
                    <h3 style={{margin:0}}>
                        {step === 1 ? 'Selecione a Área' : step === 2 ? `Pasta em ${area}` : `Arquivo em ${folder}`}
                    </h3>
                    <button className="button button--sm button--secondary" onClick={onClose}>Fechar</button>
                </div>

                {step > 1 && (
                    <button className="button button--link button--sm" style={{alignSelf: 'flex-start', marginBottom: '10px'}} onClick={() => setStep(step - 1)}>
                        ← Voltar
                    </button>
                )}

                <div style={{overflowY: 'auto', flex: 1, border: '1px solid var(--ifm-color-emphasis-200)', borderRadius: '4px'}}>
                    {loading ? <div className="padding--md text--center">Carregando...</div> : (
                        <ul className="menu__list" style={{padding: '10px'}}>
                            {/* STEP 1: ÁREAS */}
                            {step === 1 && ['programacao', 'arquitetura', 'eletronica'].map(a => (
                                <li key={a} className="menu__list-item" onClick={() => loadFolders(a)}>
                                    <a className="menu__link" style={{cursor: 'pointer', textTransform: 'capitalize'}}>📁 {a}</a>
                                </li>
                            ))}

                            {/* STEP 2 e 3: LISTA DINÂMICA */}
                            {step > 1 && list.map(item => (
                                <li key={item.name} className="menu__list-item" onClick={() => item.type === 'folder' ? loadFiles(item.name) : handleFileSelect(item.name)}>
                                    <a className="menu__link" style={{cursor: 'pointer'}}>
                                        {item.type === 'folder' ? '📂' : '📄'} {item.name}
                                    </a>
                                </li>
                            ))}
                            
                            {step > 1 && list.length === 0 && <li className="padding--sm">Nenhum item encontrado.</li>}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}