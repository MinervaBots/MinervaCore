// Componente React para visualização interativa da pinagem do ESP-32 DevKit-V1.

import React, { useState } from 'react';
import styles from './Esp32Pinagem.module.css';

// Definição de Cores das Funções
const SIGNAL_TYPES = {
    pwr: { label: "Alimentação (PWR)", color: "#ef4444" },
    gnd: { label: "Terra (GND)", color: "#94a3b8" },
    ser: { label: "Comunicação (SPI/I2C/UART)", color: "#3b82f6" },
    ana: { label: "Analógico (ADC)", color: "#10b981" },
    rtc: { label: "RTC / Controle", color: "#a855f7" },
    tch: { label: "Touch Capacitivo", color: "#ec4899" },
    dac: { label: "Saída Analógica (DAC)", color: "#f59e0b" },
    warn: { label: "Reservado / Flash", color: "#f97316" },
    gen: { label: "GPIO Padrão", color: "#64748b" }
};

const PIN_DEFINITIONS = [
    { 
        id: "EN", side: "L", pos: 0, 
        func: [{name:"EN", type:"rtc"}], 
        note: "Pino 'Chip Enable'. Puxe para BAIXO para reiniciar (Reset). Possui pull-up interno. Use um capacitor de 100nF para GND para debouncing automático." 
    },
    { 
        id: "VP", side: "L", pos: 1, isInputOnly: true, 
        func: [{name:"GPIO36", type:"gen"}, {name:"ADC1_CH0", type:"ana"}, {name:"RTC_GPIO0", type:"rtc"}], 
        note: "Apenas Entrada (Input Only). Baixo ruído (pré-amplificador). Sem resistores de pull-up/down internos." 
    },
    { 
        id: "VN", side: "L", pos: 2, isInputOnly: true, 
        func: [{name:"GPIO39", type:"gen"}, {name:"ADC1_CH3", type:"ana"}, {name:"RTC_GPIO3", type:"rtc"}], 
        note: "Apenas Entrada (Input Only). Baixo ruído (pré-amplificador). Sem resistores de pull-up/down internos." 
    },
    { 
        id: "D34", side: "L", pos: 3, isInputOnly: true, 
        func: [{name:"GPIO34", type:"gen"}, {name:"ADC1_CH6", type:"ana"}, {name:"RTC_GPIO4", type:"rtc"}], 
        note: "Apenas Entrada (Input Only). Sem resistores de pull-up/down internos. Ótimo para leitura analógica pura." 
    },
    { 
        id: "D35", side: "L", pos: 4, isInputOnly: true, 
        func: [{name:"GPIO35", type:"gen"}, {name:"ADC1_CH7", type:"ana"}, {name:"RTC_GPIO5", type:"rtc"}], 
        note: "Apenas Entrada (Input Only). Sem resistores de pull-up/down internos." 
    },
    { 
        id: "D32", side: "L", pos: 5, 
        func: [{name:"GPIO32", type:"gen"}, {name:"ADC1_CH4", type:"ana"}, {name:"TOUCH9", type:"tch"}, {name:"XTAL_P", type:"rtc"}], 
        note: "Entrada/Saída. Conectado ao cristal de 32KHz (se presente). Funcional em Deep Sleep." 
    },
    { 
        id: "D33", side: "L", pos: 6, 
        func: [{name:"GPIO33", type:"gen"}, {name:"ADC1_CH5", type:"ana"}, {name:"TOUCH8", type:"tch"}, {name:"XTAL_N", type:"rtc"}], 
        note: "Entrada/Saída. Conectado ao cristal de 32KHz (se presente). Funcional em Deep Sleep." 
    },
    { 
        id: "D25", side: "L", pos: 7, 
        func: [{name:"GPIO25", type:"gen"}, {name:"DAC_1", type:"dac"}, {name:"ADC2_CH8", type:"ana"}, {name:"RTC_GPIO6", type:"rtc"}], 
        note: "DAC Verdadeiro (Conversor Digital-Analógico). Nota: ADC2 não funciona com Wi-Fi ativo." 
    },
    { 
        id: "D26", side: "L", pos: 8, 
        func: [{name:"GPIO26", type:"gen"}, {name:"DAC_2", type:"dac"}, {name:"ADC2_CH9", type:"ana"}, {name:"RTC_GPIO7", type:"rtc"}], 
        note: "DAC Verdadeiro (Conversor Digital-Analógico). Nota: ADC2 não funciona com Wi-Fi ativo." 
    },
    { 
        id: "D27", side: "L", pos: 9, 
        func: [{name:"GPIO27", type:"gen"}, {name:"ADC2_CH7", type:"ana"}, {name:"TOUCH7", type:"tch"}, {name:"RTC_GPIO17", type:"rtc"}], 
        note: "GPIO de uso geral. Nota: ADC2 não funciona com Wi-Fi ativo." 
    },
    { 
        id: "D14", side: "L", pos: 10, 
        func: [{name:"GPIO14", type:"gen"}, {name:"HSPI_CLK", type:"ser"}, {name:"ADC2_CH6", type:"ana"}, {name:"TOUCH6", type:"tch"}, {name:"JTAG_TMS", type:"ser"}], 
        note: "Clock do HSPI. Sinal de depuração JTAG (TMS). Emite sinal PWM na inicialização." 
    },
    { 
        id: "D12", side: "L", pos: 11, isStrapping: true, 
        func: [{name:"GPIO12", type:"gen"}, {name:"HSPI_MISO", type:"ser"}, {name:"ADC2_CH5", type:"ana"}, {name:"TOUCH5", type:"tch"}, {name:"JTAG_TDI", type:"ser"}], 
        note: "⚠️ STRAPPING PIN (Crítico): Define a voltagem da Flash (3.3V vs 1.8V). Se puxado para ALTO no boot, a placa pode não ligar (Brownout)." 
    },
    { 
        id: "D13", side: "L", pos: 12, 
        func: [{name:"GPIO13", type:"gen"}, {name:"HSPI_MOSI", type:"ser"}, {name:"ADC2_CH4", type:"ana"}, {name:"TOUCH4", type:"tch"}, {name:"JTAG_TCK", type:"ser"}], 
        note: "Dados do HSPI. Sinal de depuração JTAG (TCK). ADC2 conflitante com Wi-Fi." 
    },
    { id: "GND", side: "L", pos: 13, func: [{name:"GND", type:"gnd"}], note: "Terra comum." },
    { id: "VIN", side: "L", pos: 14, func: [{name:"VIN", type:"pwr"}], note: "Entrada de 5V. Passa pelo regulador AMS1117 para virar 3.3V. Aceita até ~9V (limite térmico)." },
    { 
        id: "D23", side: "R", pos: 0, 
        func: [{name:"GPIO23", type:"gen"}, {name:"VSPI_MOSI", type:"ser"}], 
        note: "MOSI do barramento VSPI padrão. Usado para displays SPI e cartões SD." 
    },
    { 
        id: "D22", side: "R", pos: 1, 
        func: [{name:"GPIO22", type:"gen"}, {name:"I2C_SCL", type:"ser"}], 
        note: "Clock I2C padrão (Wire). Essencial para displays OLED e sensores I2C." 
    },
    { 
        id: "TX0", side: "R", pos: 2, 
        func: [{name:"GPIO1", type:"gen"}, {name:"UART0_TX", type:"ser"}], 
        note: "Saída Serial de Debug. Conectado ao chip USB. Não use se precisar do Monitor Serial." 
    },
    { 
        id: "RX0", side: "R", pos: 3, 
        func: [{name:"GPIO3", type:"gen"}, {name:"UART0_RX", type:"ser"}], 
        note: "Entrada Serial de Debug. Conectado ao chip USB. Fica em nível ALTO durante o boot." 
    },
    { 
        id: "D21", side: "R", pos: 4, 
        func: [{name:"GPIO21", type:"gen"}, {name:"I2C_SDA", type:"ser"}], 
        note: "Dados I2C padrão (Wire). Essencial para displays OLED e sensores I2C." 
    },
    { 
        id: "D19", side: "R", pos: 5, 
        func: [{name:"GPIO19", type:"gen"}, {name:"VSPI_MISO", type:"ser"}], 
        note: "MISO do barramento VSPI padrão. Usado para displays SPI e cartões SD." 
    },
    { 
        id: "D18", side: "R", pos: 6, 
        func: [{name:"GPIO18", type:"gen"}, {name:"VSPI_CLK", type:"ser"}], 
        note: "Clock do barramento VSPI padrão. Usado para displays SPI e cartões SD." 
    },
    { 
        id: "D5", side: "R", pos: 7, isStrapping: true, 
        func: [{name:"GPIO5", type:"gen"}, {name:"VSPI_CS0", type:"ser"}], 
        note: "Chip Select (CS) do VSPI. STRAPPING PIN: Gera sinal PWM no boot." 
    },
    { 
        id: "D17", side: "R", pos: 8, 
        func: [{name:"GPIO17", type:"gen"}, {name:"UART2_TX", type:"ser"}], 
        note: "Serial 2 TX. Frequentemente usado para módulos GPS ou SIM800L (HardwareSerial 2)." 
    },
    { 
        id: "D16", side: "R", pos: 9, 
        func: [{name:"GPIO16", type:"gen"}, {name:"UART2_RX", type:"ser"}], 
        note: "Serial 2 RX. Frequentemente usado para módulos GPS ou SIM800L (HardwareSerial 2)." 
    },
    { 
        id: "D4", side: "R", pos: 10, 
        func: [{name:"GPIO4", type:"gen"}, {name:"ADC2_CH0", type:"ana"}, {name:"TOUCH0", type:"tch"}, {name:"HSPI_HD", type:"ser"}], 
        note: "ADC2 (Conflito Wi-Fi). Em algumas placas, está ligado ao LED branco do flash ou cartão SD." 
    },
    { 
        id: "D2", side: "R", pos: 11, isStrapping: true, 
        func: [{name:"GPIO2", type:"gen"}, {name:"ADC2_CH2", type:"ana"}, {name:"TOUCH2", type:"tch"}, {name:"HSPI_WP", type:"ser"}], 
        note: "LED ONBOARD (Azul). STRAPPING PIN: Deve estar BAIXO ou flutuando p/ gravar código. Tem pull-down fraco." 
    },
    { 
        id: "D15", side: "R", pos: 12, isStrapping: true, 
        func: [{name:"GPIO15", type:"gen"}, {name:"ADC2_CH3", type:"ana"}, {name:"TOUCH3", type:"tch"}, {name:"HSPI_CS0", type:"ser"}, {name:"JTAG_TDO", type:"ser"}], 
        note: "STRAPPING PIN: Se ALTO, silencia mensagens de boot. JTAG TDO. Tem pull-up fraco." 
    },
    { id: "GND", side: "R", pos: 13, func: [{name:"GND", type:"gnd"}], note: "Terra comum." },
    { id: "3V3", side: "R", pos: 14, func: [{name:"3V3", type:"pwr"}], note: "Saída 3.3V do regulador. Máx ~600mA. Alimente sensores aqui." }
];

export default function Esp32Pinagem() {
    const [activePinId, setActivePinId] = useState(null);
    const activePin = PIN_DEFINITIONS.find(p => p.id === activePinId);

    const getPinType = (pin) => {
        if (!pin) return '';
        if (pin.id.startsWith('GPIO')) return pin.isInputOnly ? 'Input Only' : 'I/O Digital';
        if (['3V3', 'VIN', 'GND', 'EN'].includes(pin.id)) return 'Power/Control';
        return 'Special';
    };

    return (
        <div className={styles.container}>
            <div className={styles.workbench}>
                <svg className={styles.boardSvg} viewBox="0 0 480 680" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="pcbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" style={{stopColor:'#1a2028', stopOpacity:1}} />
                            <stop offset="100%" style={{stopColor:'#131920', stopOpacity:1}} />
                        </linearGradient>
                    </defs>
                    <rect x="110" y="40" width="260" height="520" rx="6" fill="url(#pcbGrad)" stroke="#1f2933" strokeWidth="1.5"/>
                    <rect x="140" y="75" width="200" height="170" rx="3" fill="#0a0e14" stroke="#1f2933" strokeWidth="1"/>
                    
                    <text x="240" y="160" textAnchor="middle" fill="#52606d" fontFamily="'Fira Code', monospace" fontWeight="600" fontSize="16" letterSpacing="2">ESP32</text>

                    {PIN_DEFINITIONS.map(pin => {
                        const isLeft = pin.side === 'L';
                        const xBase = isLeft ? 125 : 355;
                        const yBase = 110 + (pin.pos * 28);
                        const isSelected = activePinId === pin.id;

                        return (
                            <g 
                                key={pin.id} 
                                className={`${styles.pinGroup} ${isSelected ? styles.selected : ''}`} 
                                onClick={() => setActivePinId(pin.id)}
                            >
                                <rect x={isLeft ? xBase-12 : xBase} y={yBase-5} width="12" height="10" rx="2" className={styles.pinConductor} />
                                
                                <rect x={isLeft ? xBase-40 : xBase-10} y={yBase-14} width="50" height="28" fill="transparent" />
                                
                                {/* Texto do Pino */}
                                <text x={isLeft ? xBase-18 : xBase+18} y={yBase+4} textAnchor={isLeft ? 'end' : 'start'} className={styles.pinLabel}>
                                    {pin.id}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <aside className={styles.inspector}>
                <div className={styles.inspectorHeader}>
                    <span className={styles.label}>Inspetor de Hardware</span>
                </div>

                <div className={styles.inspectorContent}>
                    {!activePin ? (
                        <div className={styles.emptyState}>
                            <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <p>Clique em um pino da placa para ver detalhes técnicos.</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.pinIdDisplay}>{activePin.id}</div>
                            
                            <div className={styles.pinMeta}>
                                <span>{getPinType(activePin)}</span>
                                {activePin.isStrapping && <span style={{color: '#f59e0b'}}>• Strapping Pin</span>}
                                {activePin.isInputOnly && <span style={{color: '#ef4444'}}>• Apenas Entrada</span>}
                            </div>

                            <div className={styles.detailSection}>
                                <span className={styles.label}>Funções Multiplexadas</span>
                                <div className={styles.capabilitiesList}>
                                    {activePin.func.map((f, i) => {
                                        const sig = SIGNAL_TYPES[f.type];
                                        return (
                                            <span key={i} className={styles.capabilityBadge} style={{
                                                borderColor: `${sig.color}44`,
                                                color: sig.color,
                                                background: `linear-gradient(90deg, ${sig.color}11, transparent)`
                                            }}>
                                                {f.name}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className={styles.detailSection}>
                                <span className={styles.label}>Notas</span>
                                <div className={styles.techNote}>
                                    {activePin.note}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className={styles.legendFooter}>
                    <span className={styles.label} style={{marginBottom:'10px'}}>Legenda de Sinais</span>
                    <div className={styles.legendGrid}>
                        {Object.entries(SIGNAL_TYPES).map(([key, sig]) => (
                            <div key={key} className={styles.legendItem}>
                                <div className={styles.legendSwatch} style={{backgroundColor: sig.color}}></div>
                                {sig.label.split(' ')[0]}
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    );
}