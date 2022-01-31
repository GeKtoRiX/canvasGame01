// Основной модуль манипулирования путями файлов.
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        //  Исходный файл трансляции кода es6,es7 и так далее.
        main: path.resolve('src/canvas.js'),
        utils: path.resolve('src/utils.js')
    },
    // Конечный файл трансляции кода в es5.
    output: {
        // Скомпилированный файл сохраняется в папку 'build'.
        path: path.resolve(__dirname, 'dist'),
        // Имя файлов.
        filename: '[name].[contenthash].js',
        // Очистка папки при повторном вызове.
        clean: true,
    },
    // Отслеживание и сопоставление элементов.
    devtool: 'inline-source-map',
    // Настройки сервера.
    devServer: {
        // Путь создание сервера.
        static: path.resolve(__dirname, 'dist'),
        // Порт подключения.
        port: 8080,
        // Автоматическое открытие страницы.
        open: true,
    },

    // Модуль загрузки файлов трансляции.
    module: {
        // Настройки трансляции.
        rules: [
            // Использование модулей для css и style элементов.
            { test: /\.(sa|sc|c)ss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
            // Использование встроенного загрузчика файлов.
            { test: /\.(svg|ico|png|webp|jpg|gif|jpeg)$/, type: 'asset/resource' },
            // Трансляция es5-6 в нативный код и исключение из проверки папку node_modules.
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    // Транслятор кода.
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },

    plugins: [
        // Плагин создание временной html страницы.
        new HtmlWebpackPlugin({
            title: 'Canvas Project',
            filename: 'index.html',
            template: path.resolve(__dirname, `src/temp.html`),
        }),

    ],
}
