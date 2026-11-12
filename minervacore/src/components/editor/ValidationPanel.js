// Painel com o resultado da verificação de conteúdo, mostrado antes de abrir
// o Pull Request (ou quando a pessoa clica em "Verificar").
//
// state: { mode: 'save' | 'check', running, result, error }
//   result: { errors, warnings, preexisting } de contentValidation.js

import React from 'react';
import { Icons } from '../Icons';

const IssueItem = ({ issue, tone, onJump }) => {
    const canJump = Boolean(onJump && issue.line);
    const location = [issue.where, issue.line ? `linha ${issue.line}` : null].filter(Boolean).join(' · ');

    return (
        <li
            className={`validation-issue validation-issue--${tone}${canJump ? ' validation-issue--clickable' : ''}`}
            onClick={canJump ? () => onJump(issue.line) : undefined}
            title={canJump ? 'Ir para esta linha no editor' : undefined}
        >
            <div className="validation-issue__message">{issue.message}</div>
            {location && <div className="validation-issue__where">{location}</div>}
            {issue.snippet && <code className="validation-issue__snippet">{issue.snippet}</code>}
            {issue.hint && <div className="validation-issue__hint">{issue.hint}</div>}
        </li>
    );
};

const IssueList = ({ title, issues, tone, onJump }) => (
    <section className="margin-bottom--md">
        <h4 className={`validation-section__title validation-section__title--${tone}`}>
            {title} ({issues.length})
        </h4>
        <ul className="validation-list">
            {issues.map((issue, i) => (
                <IssueItem key={`${issue.message}-${issue.line}-${i}`} issue={issue} tone={tone} onJump={onJump} />
            ))}
        </ul>
    </section>
);

export default function ValidationPanel({ state, onClose, onConfirm, onRetry, onJump }) {
    if (!state) return null;

    const { mode, running, result, error } = state;
    const errors = result?.errors || [];
    const warnings = result?.warnings || [];
    const preexisting = result?.preexisting || [];
    const clean = result && errors.length === 0 && warnings.length === 0;

    let heading = 'Verificando conteúdo...';
    if (error) heading = 'Não foi possível verificar';
    else if (errors.length) heading = 'Corrija antes de enviar';
    else if (warnings.length) heading = 'Confira antes de enviar';
    else if (clean) heading = 'Nenhum problema encontrado';

    return (
        <div className="validation-overlay" role="dialog" aria-modal="true" aria-label={heading}>
            <div className="card validation-panel">

                <div className="validation-panel__header">
                    <h3 style={{margin: 0}}>{heading}</h3>
                    {!running && (
                        <button className="button button--sm button--link" onClick={onClose} aria-label="Fechar">
                            {Icons.close}
                        </button>
                    )}
                </div>

                <div className="validation-panel__body">
                    {running && (
                        <div className="validation-panel__running">
                            {Icons.loading}
                            <span>Conferindo sintaxe, imagens e links como o build do site faz...</span>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert--danger">
                            {error}
                        </div>
                    )}

                    {errors.length > 0 && (
                        <>
                            <p className="validation-panel__intro">
                                Estes problemas quebrariam o site ou deixariam algo visivelmente quebrado.
                                O Pull Request só pode ser criado depois de corrigir.
                            </p>
                            <IssueList title="Precisa corrigir" issues={errors} tone="error" onJump={onJump} />
                        </>
                    )}

                    {warnings.length > 0 && (
                        <IssueList title="Vale conferir" issues={warnings} tone="warning" onJump={onJump} />
                    )}

                    {clean && mode === 'check' && (
                        <p className="validation-panel__intro">
                            {Icons.success} O conteúdo passou em todas as verificações.
                        </p>
                    )}

                    {preexisting.length > 0 && (
                        <details className="validation-preexisting">
                            <summary>
                                {preexisting.length} problema(s) que já existiam antes da sua edição
                            </summary>
                            <p className="validation-panel__intro">
                                Não bloqueiam o envio, mas se puder aproveitar para corrigir, melhor.
                            </p>
                            <ul className="validation-list">
                                {preexisting.map((issue, i) => (
                                    <IssueItem key={`pre-${i}`} issue={issue} tone="muted" onJump={onJump} />
                                ))}
                            </ul>
                        </details>
                    )}
                </div>

                {!running && (
                    <div className="validation-panel__footer">
                        {error && onRetry && (
                            <button className="button button--secondary" onClick={onRetry}>Tentar de novo</button>
                        )}
                        <button className="button button--secondary button--outline" onClick={onClose}>
                            {errors.length || warnings.length ? 'Voltar e corrigir' : 'Fechar'}
                        </button>
                        {mode === 'save' && !error && errors.length === 0 && warnings.length > 0 && (
                            <button className="button button--warning" onClick={onConfirm}>
                                Criar PR mesmo assim
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
