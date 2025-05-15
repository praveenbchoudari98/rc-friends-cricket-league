declare module 'framer-motion' {
    import { ComponentType, CSSProperties, ReactElement } from 'react';

    export interface MotionProps {
        initial?: any;
        animate?: any;
        transition?: any;
        style?: CSSProperties;
        [key: string]: any;
    }

    export type Motion = {
        (component: any): ComponentType<any>;
        div: ComponentType<any>;
        span: ComponentType<any>;
        img: ComponentType<any>;
        button: ComponentType<any>;
        a: ComponentType<any>;
        ul: ComponentType<any>;
        li: ComponentType<any>;
        ol: ComponentType<any>;
        nav: ComponentType<any>;
        footer: ComponentType<any>;
        header: ComponentType<any>;
        section: ComponentType<any>;
        form: ComponentType<any>;
        main: ComponentType<any>;
        article: ComponentType<any>;
        aside: ComponentType<any>;
    };

    export const motion: Motion;
    export const AnimatePresence: ComponentType<any>;
} 