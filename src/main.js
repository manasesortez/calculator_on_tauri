class Calculadora {
  constructor(valorPrevioTextElement, valorActualTextElement) {
      this.valorPrevioTextElement = valorPrevioTextElement
      this.valorActualTextElement = valorActualTextElement
      this.borrarTodo();
      this.resultadoMostrado = false; // Nueva propiedad para saber si se ha mostrado el resultado
  }

  borrarTodo() {
      this.valorActual = ''
      this.valorPrevio = ''
      //modificacion para que el display superior se borre cuando se presiona AC
      this.valorPrevioTextElement.innerText = '';
      this.operacion = undefined
  }

  borrar() {
      //modificacion para que el display superior se borre cuando se presiona AC
      this.valorPrevioTextElement.innerText = '';
      this.valorActual = this.valorActual.toString().slice(0, -1)
  }

  agregarNumero(numero) {
      //this.valorActual = numero
      if (numero === '.' && this.valorActual.includes('.')) return

      if (this.valorActual.length < 9) {
          this.valorActual = this.valorActual.toString() + numero.toString();
      }
      
  }

  elejirOperacion(operacion) {
      if (this.valorActual === '') return
      if (this.valorPrevio !== '') {
          this.calcular()
      }
      this.operacion = operacion
      this.valorPrevio = this.valorActual
      this.valorActual = ''
  }

  calcular() {
      let resultado
      const valor_1 = parseFloat(this.valorPrevio)
      const valor_2 = parseFloat(this.valorActual)
      if (isNaN(valor_1) || isNaN(valor_2)) return
      switch (this.operacion) {
          case '+':
              resultado = valor_1 + valor_2
              break
          case '-':
              resultado = valor_1 - valor_2
              break
          case 'x':
              resultado = valor_1 * valor_2
              break
          case '÷':
              resultado = valor_1 / valor_2
              break
          default:
              return
      }
      this.valorActual = resultado.toPrecision(8);
      this.operacion = undefined
      this.valorPrevio = ''
  }

  obtenerNumero(numero) {
      const cadena = numero.toString()
      const enteros = parseFloat(cadena.split('.')[0])
      const decimales = cadena.split('.')[1]
      let mostrarEnteros
      if (isNaN(enteros)) {
          mostrarEnteros = ''
      } else {
          mostrarEnteros = enteros.toLocaleString('en', { maximumFractionDigits: 0 })
      }

      if (decimales != null) {
          return `${mostrarEnteros}.${decimales}`
      } else {
          return mostrarEnteros
      }
  }

  actualizarPantalla() {
      if (this.operacion != null) {
          const operacionCompleta = `${this.obtenerNumero(this.valorPrevio)} ${this.operacion} ${this.obtenerNumero(this.valorActual)}`;
          this.valorPrevioTextElement.innerText = operacionCompleta;
          //Agregue esto para que se elimine el ultimo numero del display actual ya que se mira feo
          this.valorActualTextElement.innerText = '';
      }else{
          // Se muestra el resultado en el display inferior
          this.valorActualTextElement.innerText = this.obtenerNumero(this.valorActual);
      }
  }

  calcularPorcentaje() {
      const valor = parseFloat(this.valorPrevio);
      const porcentaje = parseFloat(this.valorActual) / 100;
  
      if (isNaN(valor) || isNaN(porcentaje)) {
          console.error('Error: Valor o porcentaje no son números válidos.');
          return;
      }
  
      let resultado;
  
      if (porcentaje === 0) {
          resultado = valor; // Si el porcentaje es cero, el resultado es el valor actual
      } else {
          switch (this.operacion) {
              case '+':
                  resultado = valor + (valor * porcentaje);
                  break;
              case '-':
                  resultado = valor - (valor * porcentaje);
                  break;
              case 'x':
                  resultado = valor * porcentaje;
                  break;
              case '÷':
                  if (porcentaje === 0) {
                      console.error('Error: División por cero.');
                      return;
                  }
                  resultado = valor / (porcentaje);
                  break;
              default:
                  console.error('Error: Operación no reconocida.');
                  return;
          }
      }
  
      // Se muestra el resultado en el display inferior con el valor del porcentaje %
      const operacionCompleta = `${this.obtenerNumero(this.valorPrevio)} ${this.operacion} ${this.obtenerNumero(this.valorActual)}%`;
      this.valorPrevioTextElement.innerText = operacionCompleta;
  
      this.operacion = undefined;
      this.valorPrevio = '';
      this.valorActual = resultado.toPrecision(8); // Ajustar la cantidad de decimales
  }
  

  realizarSiguienteOperacionDespuesIgual() {
      if (this.resultadoMostrado) {
          // Si se ha mostrado el resultado y se presiona un número, inicia una nueva operación
          this.borrarTodo();
          this.resultadoMostrado = false;
      }
  }

}

//Captura de datos del DOM
const numeroButtons = document.querySelectorAll('[data-numero]')
const operacionButtons = document.querySelectorAll('[data-operacion]')
const igualButton = document.querySelector('[data-igual]')
const porcentajeButton = document.querySelector('[data-porcentaje]')
const borrarButton = document.querySelector('[data-borrar]')
const borrarTodoButton = document.querySelector('[data-borrar-todo]')
const valorPrevioTextElement = document.querySelector('[data-valor-previo]')
const valorActualTextElement = document.querySelector('[data-valor-actual]')

// Instanciar un nueo objeto de tipo calculadora
const calculator = new Calculadora(valorPrevioTextElement, valorActualTextElement)

porcentajeButton.addEventListener('click', () => {
  calculator.calcularPorcentaje();
  calculator.actualizarPantalla();
});

numeroButtons.forEach(button => {
  button.addEventListener('click', _button => {
      calculator.realizarSiguienteOperacionDespuesIgual(); // Llama a la nueva función
      calculator.agregarNumero(button.innerText)
      calculator.actualizarPantalla()
  })
})

operacionButtons.forEach(button => {
  button.addEventListener('click', () => {
      calculator.resultadoMostrado = false; // Marcar que se va a realizar una nueva operación
      calculator.elejirOperacion(button.innerText)
      calculator.actualizarPantalla()
  })
})

igualButton.addEventListener('click', _button => {
  calculator.calcular();
  calculator.actualizarPantalla();
  calculator.resultadoMostrado = true; // Marcar que se ha mostrado el resultado
});

borrarTodoButton.addEventListener('click', _button => {
  calculator.borrarTodo()
  calculator.actualizarPantalla()
})

borrarButton.addEventListener('click', _button => {
  calculator.borrar()
  calculator.actualizarPantalla()
})

/*Parcial:
1. Arreglar bug que limite los numeros en pantalla
2. Funcionabilidad de boton de porcentaje
3. Si lo que se presiona despues de igual es un numero entonces que borre el resultado anterior e inicie una nueva operacion
4. Muestre la operacion completa en el display superior
*/
