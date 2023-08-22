/*Comentarios*/
/*  En estas dos primeras variables estoy seleccionando todos los productos que en el HTML se identifican con class=producto,
englobándolos bajo la variable de objetosArrastrables. De la misma forma, también identifico que el contenedor de carrito
con id=drop-area, este contenedor será el lugar donde se sueltan los productos.
    Finalmente, carritoArea se identifica con un contenedor en el que se mostrarán los productos una vez ya arrastrados y soltados
Se usa querySelectorAll cuando hay múltiples elementos, pero usamos getElementById cuando queremos seleccionar solo un elemento. */
const objetosArrastrables = document.querySelectorAll('.producto img');
const dropArea = document.getElementById('drop-area');
const carritoArea = document.getElementById('carrito-area');
/* Preparamos el total de la suma de los productos y se deja a 0 para luego poder sumar o restar a partir de aquí*/
let totalValue = 0; 

/* Itera sobre los objetos que se han definido como objetosArrastrables y agrega el evento dragstart.
 Además, dataTransfer.setData define los datos que van a ser arrastrados durante la operación.
 Las variables itemNumber y imgData manejan información de los objetos arrastrables, información que se usará luego.*/
objetosArrastrables.forEach(item => {
    const parent = item.parentElement;
    parent.addEventListener('dragstart', e => {

        const itemNumber = parent.getAttribute('data-number');

        const imgData = {
            src: item.src,
            alt: item.alt, 
            number: item.parentElement.getAttribute('data-number'),
            text: item.parentElement.getAttribute('data-text') };
        e.dataTransfer.setData('text/plain', JSON.stringify(imgData));
    });
});

/* Se crea un evento de dragover en el area de soltar, llamada dropArea. Al añadir preventDefault, se evita el comportamiento
predeterminado del navegador, que podría cancelar o irrumpir en la operación de arrastrar y soltar */
dropArea.addEventListener('dragover', e => {
    e.preventDefault();
});

/* El evento de drop es el de soltar el elemento en el dropArea.  */
dropArea.addEventListener('drop', e => {
    e.preventDefault();
    /* getData recoge los datos del elemento que se ha arrastrado y soltado */
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));

    /*Realiza la suma del total de los productos*/
    totalValue += parseFloat(data.number);
    document.getElementById('totalValue').textContent = `${totalValue.toFixed(2)}€`;

    /* Se crea un elemento nuevo <div> con los datos del elemento arrastrado. En este caso se crearía una copia del producto que hemos arrastrado y soltado */
    const newItem = document.createElement('div');
    newItem.classList.add('producto-drop');

    /* El elemento nuevo que se crea es una imagen, igual que la que está reflejada en producto en el HTML */
    const imgElement = document.createElement('img');
    imgElement.src = data.src;
    imgElement.alt = data.alt;
    newItem.appendChild(imgElement);
    
    /* Se crea un elemento span, que mostraría el contenido del objeto arrastrado, en este caso,
    incluiríamos el nombre del producto por un lado y el precio por otro lado */
    const nombreContent = document.createElement('span');
    nombreContent.classList.add('nombre')
    nombreContent.textContent = `${data.text} `;
    newItem.appendChild(nombreContent);

    const precioContent = document.createElement('span');
    precioContent.classList.add('precio')
    precioContent.textContent = `(${data.number})`;
    newItem.appendChild(precioContent);

    
    /* Botón de eliminar: con esta funcionalidad se puede eliminar uno de los productos que están en el carrito */ 
    const eliminarBoton = document.createElement('button');
    eliminarBoton.classList.add('button');
    eliminarBoton.textContent = 'X';
    eliminarBoton.addEventListener('click', () => {
        newItem.remove();
        totalValue -= parseFloat(data.number);
        document.getElementById('totalValue').textContent = `${totalValue.toFixed(2)}€`;
    });
    newItem.appendChild(eliminarBoton);
    
    /* Crea el elemento newItem en el carrito, anteriormente ya se ha definido que el newItem son las copias de los productos
    que han sido arrastrados y soltados */ 
    carritoArea.appendChild(newItem);
});

/* Para finalizar la compra se puede hacer click en el siguiente botón, que informará al cliente de que ha realizado el pedido con éxito */
const terminarCompra = document.getElementById('terminarCompra');

terminarCompra.addEventListener('click', () => {
    const totalValue = parseFloat(document.getElementById('totalValue').textContent);
    
    const confirmMessage = `El importe de su pedido es ${totalValue.toFixed(2)}€.¿Desea realizar el pago?`;

    if (confirm(confirmMessage)) {
        const completeMessage = "Pedido realizado, muchas gracias por visitarnos.";
        alert(completeMessage);
        location.reload(); // Actualiza la página.
    } else {
        const continueShoppingMessage = "Puede seguir con su pedido.";
        alert(continueShoppingMessage);
    }
});

