const iniciar_btn = document.querySelector("#iniciar-btn");
const registrar_btn = document.querySelector("#registrar-btn");
const container = document.querySelector(".container");
const iniciar_btn2 = document.querySelector("#iniciar-btn2")
const registrar_btn2 = document.querySelector("#registrar-btn2")

registrar_btn.addEventListener("click", () => {
    container.classList.add("modo-registrar")
});

iniciar_btn.addEventListener("click", () => {
    container.classList.remove("modo-registrar")
});

registrar_btn2.addEventListener("click", () => {
    container.classList.add("modo-registrar2")
});

iniciar_btn2.addEventListener("click", () => {
    container.classList.remove("modo-registrar2")
});