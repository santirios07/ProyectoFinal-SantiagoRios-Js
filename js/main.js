//TRAYENDO DEL HTML
const listaProductos = document.querySelector("#lista-productos");
const listaCarrito = document.querySelector("#lista-carrito");
const carritoIcono = document.querySelector("#carrito-icono");
const carritoVacio = document.querySelector("#carrito-vacio");
const carritoTotal = document.querySelector("#carrito-total");
const botonesCarrito = document.querySelector("#botones-carrito");
const iconoCantidad = document.querySelector("#icono-cantidad");
const cerrarCarrito = document.querySelector("#cerrar-carrito");
const continuarCompra = document.querySelector("#continuar-compra");

//DEFINIENDO ARRAY DEL CARRITO SI ESTA EN LOCALSTORAGE O VACIO PARA IR AGREGANDO LOS PRODUCTOS
let carrito= JSON.parse(localStorage.getItem("carrito")) || [];

//FETCH A JSON DE PRODUCTOS
async function obtenerProductos() {
    try {
        const response = await fetch("./data/productos.json");
        const data = await response.json();
        mostrarProductos(data);
    } catch (error) {
        listaProductos.append("Error al obtener productos");
        console.error("Error al obtener los productos:", error);
    }
}

// LLAMADO A LA FUNCION DE OBTENER PRODUCTOS
obtenerProductos();

//ACTUALIZAR CARRITO POR SI HAY EN LOCAL STORAGE
actualizarCarrito();


//MOSTRANDO PRODUCTOS EN HTML
function mostrarProductos(productos){
    productos.forEach((producto) => {
        const div = document.createElement("div");
        div.classList.add("py-5");
        div.innerHTML = `
        <div class="bg-gray-100 shadow-md rounded-lg">
            <div class="max-w-sm">            
                <img class="p-6 object-cover w-full" src="${producto.img}" alt="Short Lila">
            </div>
            <div class="px-5 pb-5 items-center">
                <h3 class="text-gray-900 text-xl">${producto.titulo}</h3>
                <div class="flex items-center justify-between py-2">
                <span class="text-2xl font-bold text-gray-900">$${producto.precio}</span>
                <button class="text-white bg-gray-700 hover:bg-gray-800 rounded-lg text-sm px-3 py-2 text-center" id="${producto.id}">Agregar al carrito</button>
                </div>
            </div>
        </div>
        `;
        listaProductos.append(div);
    
        const botonAgregar = document.querySelector(`#${producto.id}`);
    
        botonAgregar.addEventListener("click", () =>{
            agregarAlCarrito(producto);
            document.querySelector("#carrito").classList.remove("hidden");
            toastifyAlert("AGREGADO");

        })
    });
}

//FUNCION QUE ACTUALIZA CARRITO PARA MOSTRAR LA VISUAL
function actualizarCarrito (){
    if (carrito.length === 0){
        carritoVacio.classList.remove("hidden");
        botonesCarrito.classList.add("hidden");
        listaCarrito.innerHTML = '';
    } else{
        carritoVacio.classList.add("hidden");
        botonesCarrito.classList.remove("hidden");
        listaCarrito.innerHTML = '';
        carrito.forEach(producto => {
            //CREANDO PRODUCTO EN EL CARRITO
            const productoCarrito = document.createElement('li');
            productoCarrito.classList.add('flex', 'py-6');
            productoCarrito.innerHTML = `
                <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img src="${producto.img}" alt="${producto.titulo}" class="h-full w-full object-cover object-center">
                </div>
                <div class="ml-4 flex flex-1 flex-col">
                    <div>
                        <div class="flex justify-between text-base font-medium text-gray-900">
                            <h3>
                                <a href="#">${producto.titulo}</a>
                            </h3>
                            <p class="ml-4">$${producto.precio * producto.cantidad}</p>
                        </div>
                    </div>
                    <div class="flex flex-1 items-end justify-between text-sm">
                        <p class="text-gray-500">Cant: <span>${producto.cantidad}</span></p>
                        <div class="flex">
                            <button type="button" class="font-medium text-orange-600 hover:text-orange-500" id="borrar-${producto.id}">Borrar</button>
                        </div>
                    </div>
                </div>
            `;
            listaCarrito.append(productoCarrito);

            const borrarCarrito = document.querySelector(`#borrar-${producto.id}`);

            borrarCarrito.addEventListener("click", () =>{
                alertaBorrar(producto);
            })

            
        })
    }
    actualizarTotal();
    actualizarHeader ();
    //AGREGAR CARRITO AL LOCAL STORAGE
    localStorage.setItem("carrito", JSON.stringify(carrito));
}



//AGREGAR PRODUCTOS AL CARRITO
function agregarAlCarrito (producto){
    const itemEnCarrito = carrito.find(item => item.id === producto.id);
    itemEnCarrito ? itemEnCarrito.cantidad++ : carrito.push({...producto, cantidad:1});

    actualizarCarrito ();
}

//BORRAR PRODUCTOS DEL CARRITO
function borrarDelCarrito(producto){
    const prodIndex = carrito.findIndex(item => item.id === producto.id);
    carrito.splice(prodIndex, 1);
    toastifyAlert("ELIMINADO");

    actualizarCarrito();
}

function actualizarTotal (){
    const total = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    carritoTotal.innerText =`$${total}`;
}

function actualizarHeader (){
    const cantidadProductos = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    iconoCantidad.innerText = cantidadProductos;
}


//BOTON ESQUINA CERRAR CARRITO
cerrarCarrito.addEventListener("click", () =>{
    document.querySelector("#carrito").classList.add("hidden");
})

//BOTON CONTINUAR COMPRA CARRITO
continuarCompra.addEventListener("click", () =>{
    document.querySelector("#carrito").classList.add("hidden");
})

//ICONO DE CARRITO QUE ABRE EL CARRITO
carritoIcono.addEventListener("click", () =>{
    document.querySelector("#carrito").classList.remove("hidden");
})

//FUNCION DE TOASTIFY
function toastifyAlert (estado){
    Toastify({
        text: `PRODUCTO ${estado}`,
        duration: 2000,
        close: true,
        position: "left",
        style:{
            background: "#333",
            borderRadius: "3px",
        },
    }).showToast();
}


//FUNCION SWEETALERT AL BORRAR PRODUCTO

function alertaBorrar(producto){
    Swal.fire({
        icon: "warning",
        title: "¿Está seguro que desea eliminar el producto?",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        confirmButtonColor: "#FF9700",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
        borrarDelCarrito(producto);
        }
      });
}