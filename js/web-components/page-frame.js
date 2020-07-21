export default class PageFrame extends HTMLElement {

    constructor() {
        super();
        this.productList = undefined;
        this.attachShadow( {mode: 'open'});

        this.draw();
    }

    draw() {
        this.shadowRoot.innerHTML = `
                
            <!-- app.css - contine css imports pentru header si aside -->
            <link rel="stylesheet" href="css/app.css">
           
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    flex-grow: 1;
                }
                
              
                .container.container--flex {
                    flex-grow: 1;
                }
                
                main {
                    width: 100% ;
                }
            </style>
            
            <header class="header">
                <h1>
                    <a href="index.html">
                        <span>Pop's Game Shop</span>
                        <img src="icons/joker.svg">
                    </a>
                </h1>
                <nav>
                    <a class="button" href="admin.html">Admin</a> 
                    <a class="button" href="index.html">Acasa</a>
                    <a class="button" href="cart.html">Cos cumparaturi</a>
                </nav>
            </header>
           
                               
            <div class="container container--flex">
                <aside>
                   <slot name="aside-content"></slot>
                </aside>
                <main>
                    <slot name="content"></slot>
                </main>
            </main>      
       `;
    }

}

