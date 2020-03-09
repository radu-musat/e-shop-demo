import DrawService from "./draw.services.js";

export default class CarouselService {
     constructor(){
         this.drawService = new DrawService();
     }

     init() {
        this.setCarousel()
     }

     async setCarousel() {

        let response = await fetch("https://web-e-shop.firebaseio.com/.json");
        let productList = await response.json();
        this.drawService.drawCarouselItems(productList);

        setTimeout(function () {
            $(".owl-carousel").owlCarousel({
                autoplay: true,
                margin: 10,
                nav: true,
                loop: true,
                responsive: {
                    0:{
                        items: 1
                    }
                }
            }, 1500);
        })

    }

}
