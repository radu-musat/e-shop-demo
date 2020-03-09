import PageFrame from "../web-components/page-frame.js";
import DrawService from "../services/draw.services.js";
import CarouselService from "../services/carousel.service.js";
import LoaderService from "../services/loader.service.js";

export default class MainPage {
    constructor() {
        this.container = document.querySelector('.content');
        this.drawService = new DrawService(this.container);
        this.carouselService = new CarouselService();
        this.loader = new LoaderService();
        this.init();
    }

    init() {
        console.log('init');

        customElements.define('rm-frame', PageFrame);
        this.drawService.draw('front-page');
        this.carouselService.setCarousel();
    }
}
