import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';


export default scriptName => ({
    entry: 'munchkinland/src/' + scriptName + '.js',
    format: 'iife',
    plugins: [
        resolve(),
        babel({ exclude: 'node_modules/**/*' })
    ],
    dest: 'munchkinland/dist/' + scriptName + '.js'
});
