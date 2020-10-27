class Caracteristicas extends HTMLElement {
    constructor() {
        super();
        const template = document.createElement('template');
        const description = this.getAttribute('data-description') || 'Breve description.';
        const features = this.getAttribute('data-features') || 'Caracteristica 1. Caracteristica 2';

        const style = document.createElement('style');
        style.innerHTML = getStyle();

        const container = document.createElement('div');
        container.classList.add('caracteristicas');
        container.append(...getContainer(description, features, container));

        template.append(style, container);

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.append(...template.childNodes);
    }
}

customElements.define('tag-caracteristicas', Caracteristicas);

function getStyle() {
    return `.caracteristicas {
        padding: 0 10px;
        background-color: white;
        color: black;
    }
    
    @media (min-width: 480px) {
        .caracteristicas {
            padding: 5px 20px;
        }
    }
    
    @media (min-width: 992px) {
        .caracteristicas {
            padding: 10px 30px;
        }
    }
    
    .caracteristicas .header {
        display: flex;
        align-items: center;
        font-size: 20px;
    }
    
    @media (min-width: 480px) {
        .caracteristicas .header {
            font-size: 26px;
        }
    }
    
    @media (min-width: 992px) {
        .caracteristicas .header {
            font-size: 32px;
        }
    }
    
    .caracteristicas .header .image {
        background-image: url(/favicon.ico);
        background-position: center center;
        background-size: cover;
        width: 25px;
        height: 25px;
        margin-right: 10px;
    }
    
    @media (min-width: 480px) {
        .caracteristicas .header .image {
            width: 30px;
            height: 30px;
        }
    }
    
    @media (min-width: 992px) {
        .caracteristicas .header .image {
            width: 35px;
            height: 35px;
        }
    }
    
    .content {
        opacity: 0;
        overflow: hidden;
        max-height: 0;
        padding: 0;
        transition: max-height 1s ease-out, opacity 1s ease, padding 1s ease;
    }
    
    @media (min-width: 992px) {
        .content {
            font-size: 20px;
        }
    }
    
    .content.show {
        opacity: 1;
        padding: 10px;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.02);
        max-height: 350px;
    }
    
    .btn {
        width: 40px;
        height: 40px;
        text-align: center;
        font-weight: bolder;
        font-size: 34px;
        display: inline-block;
        line-height: 1;
        margin-left: auto;
        cursor: pointer;
    }
    
    .btn:last-of-type {
        margin: 0 2px;
        font-weight: unset;
    }
    
    @media (min-width: 768px) {
        .btn:last-of-type {
            margin: 0 10px;
        }
    }
    
    .btn:last-of-type:hover {
        color: red;
    }

    .button {
        width: 50%;
        line-height: 2;
        text-align: center;
        border: 1px dotted black;
        color: black;
        background-color:rgb(220,220,220);
        padding: 4px;
        margin-left: auto;
        font-weight: bold;
        text-transform: uppercase;
        display:block;
        text-decoration: none;
    }

    @media (min-width: 480px){
        .button {
            width: 25%;
        }
    }

    .button:hover {
        border: 1px solid black;
    }
    `;
}

function getContainer(description, features, container) {
    const temporal = document.createElement('div');

    const header = document.createElement('div');
    header.classList.add('header');
    header.innerHTML = `<a href="/" class="image"></a>Características`;

    const btnPlus = document.createElement('div');
    btnPlus.classList.add('btn');
    btnPlus.textContent = '+';

    const btnClose = document.createElement('div');
    btnClose.classList.add('btn');
    btnClose.textContent = 'x';

    header.appendChild(btnPlus);
    header.appendChild(btnClose);

    const content = document.createElement('div');
    content.classList.add('content');

    var p = document.createElement('p');
    p.innerText = description;

    content.appendChild(p);

    p = document.createElement('p');
    p.innerText = 'Contiene:';
    content.appendChild(p);

    var split = features.split('.');
    const ul = document.createElement('ul');
    for (let i = 0, l = split.length; i < l; i++) {
        if (split[i] != "") {
            const li = document.createElement('li');
            li.innerText = split[i].replace(/(\r\n|\n|\r)/gm, "") + '.';
            ul.appendChild(li);
        }
    }

    content.appendChild(ul);

    var contacto = '/contacto?template=' + window.location.href.split('/')[5];
    const button = document.createElement('a');
    button.innerText = 'Seleccionar';
    button.setAttribute('href', contacto);
    button.classList.add('button');

    content.appendChild(button);


    btnPlus.addEventListener('click', function() {
        content.classList.toggle("show");
    });
    btnClose.addEventListener('click', function() {
        container.remove();
    });

    temporal.appendChild(header);
    temporal.appendChild(content);

    return temporal.childNodes;
}