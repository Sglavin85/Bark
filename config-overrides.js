const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            '@primary-color': '#324759',
            '@box-shadow-base': 'box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
            '@body-background': '#DFE1E2',
            '@menu-bg': '#DFE1E2',
            '@menu-inline-toplevel-item-height': '80px',
            '@menu-item-height': '75px',
            '@background-color-light': '#DFE1E2',
            '@layout-header-background': '#DFE1E2',
            '@layout-header-height': '100px'
        },
    }),
);