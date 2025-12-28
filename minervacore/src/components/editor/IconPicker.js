// Arquivo para gerar uma galeria de ícones SVG do repositório e permitir upload via PR

import React, { useState, useEffect } from 'react';
import { getFolderContents, createPullRequest } from '../../utils/githubApi';

const ICONS_PATH = 'minervacore/static/img/icons';

export default function IconPicker({ userToken, onSelect, onClose }) {
    const [icons, setIcons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Carregar ícones do GitHub
    useEffect(() => {
        async function loadIcons() {
            try {
                const files = await getFolderContents(ICONS_PATH, userToken);
                // Filtra só o que é .svg
                const svgFiles = files.filter(f => f.name.endsWith('.svg'));
                setIcons(svgFiles);
            } catch (e) {
                console.error("Erro ao ler ícones:", e);
            } finally {
                setLoading(false);
            }
        }
        loadIcons();
    }, [userToken]);

    // Lógica de Upload
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.svg')) {
            alert("Apenas arquivos .svg são permitidos!");
            return;
        }

        setUploading(true);
        const reader = new FileReader();
        
        reader.onload = async (event) => {
            const content = event.target.result; // Conteúdo do SVG
            
            try {
                const filename = file.name.toLowerCase().replace(/\s+/g, '-');
                const prLink = await createPullRequest({
                    token: userToken,
                    filePath: `${ICONS_PATH}/${filename}`,
                    newContent: content, // O conteúdo do SVG
                    prTitle: `Add Icon: ${filename}`,
                    prBody: `Adicionando novo ícone SVG via Editor: ${filename}`
                });

                alert(`Ícone enviado! Um PR foi criado.\n\nComo o PR precisa ser aprovado, o ícone pode não aparecer imediatamente na galeria, mas já selecionamos o caminho para você.`);
                
                // Seleciona o caminho imediatamente
                onSelect(`/img/icons/${filename}`);
                onClose();

            } catch (error) {
                alert(`Erro no upload: ${error.message}`);
            } finally {
                setUploading(false);
            }
        };

        reader.readAsText(file); // SVGs são texto XML
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div className="card padding--md" style={{width: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column'}}>
                
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
                    <h3>Galeria de Ícones</h3>
                    <button className="button button--sm button--secondary" onClick={onClose}>Fechar</button>
                </div>

                {/* Área de Upload */}
                <div style={{border: '2px dashed var(--ifm-color-primary)', padding: '20px', textAlign: 'center', marginBottom: '20px', borderRadius: '8px'}}>
                    {uploading ? <p>Enviando...</p> : (
                        <>
                            <p style={{margin: 0, fontWeight: 'bold'}}>Adicionar Novo SVG</p>
                            <input type="file" accept=".svg" onChange={handleFileUpload} style={{marginTop: '10px'}} />
                        </>
                    )}
                </div>

                {/* Grid de Ícones */}
                <div style={{overflowY: 'auto', flex: 1, border: '1px solid #444', padding: '10px', borderRadius: '4px'}}>
                    {loading ? <p>Carregando galeria...</p> : (
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px'}}>
                            {icons.map(icon => (
                                <div 
                                    key={icon.sha} 
                                    className="card"
                                    style={{cursor: 'pointer', padding: '10px', alignItems: 'center', border: '1px solid transparent'}}
                                    onClick={() => {
                                        onSelect(`/img/icons/${icon.name}`);
                                        onClose();
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--ifm-color-primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                                >
                                    {/* download_url para preview */}
                                    <img src={icon.download_url} style={{width: '32px', height: '32px', filter: 'invert(1)'}} />
                                    <small style={{fontSize: '0.6rem', marginTop: '5px', wordBreak: 'break-all', lineHeight: '1'}}>
                                        {icon.name}
                                    </small>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}