import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/index.css';
import css from './index.module.css';

ReactDOM.render(
    <React.StrictMode>
        <div className={css.app}>App</div>
    </React.StrictMode>,
    document.getElementById('root'),
);
