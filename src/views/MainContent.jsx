
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { permissionsConfig } from '../config/permissionsConfig';

export default function MainContent() {

    const currentConfig = Object.values(permissionsConfig).find(
        config => config.path === location.pathname
    );

    const Component = currentConfig.component;

    return <Component/>
}

