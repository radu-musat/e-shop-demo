export default class LoaderService {
    constructor() {
        window.addEventListener('load', ()=> {
            let loader = document.querySelector('.loader')
            loader.className += ' loader--inactive';
        });
    }
}
