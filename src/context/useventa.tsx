"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VentaContextProps {
    idVenta: string;
    setIdVentaContext: (id: string) => void;
}

export const VentaContext = createContext<VentaContextProps>({
    idVenta: '',
    setIdVentaContext: () => { },
});

export const VentaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [idVenta, setIdVenta] = useState<string>('');

    function setIdVentaContext(id: string) {
        setIdVenta(id);
    }

    return (
        <VentaContext.Provider value={{ idVenta, setIdVentaContext }}>
            {children}
        </VentaContext.Provider>
    );
};
