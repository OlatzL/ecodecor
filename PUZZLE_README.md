# Ecodecor Sliding Puzzle - Documentación

## Descripción General

Rompecabezas deslizante 4x4 (15 piezas + 1 espacio vacío) que recompensa a los usuarios con un código de descuento del 5% al completarlo exitosamente.

## Archivos del Sistema

### HTML
- **puzzle.html**: Página principal del rompecabezas
  - Estructura semántica con HTML5
  - Incluye secciones para: título, información del juego, controles, tablero y modal de éxito

### CSS
- **css/puzzle.css**: Estilos completos del juego
  - Variables CSS para colores de la marca Ecodecor
  - Diseño responsive (mobile-first)
  - Animaciones suaves para transiciones de piezas
  - Modal elegante para mostrar código de descuento
  - Paleta de colores nórdica y minimalista

### JavaScript
- **js/puzzle.js**: Lógica completa del juego
  - Clase `SlidingPuzzle` que maneja toda la funcionalidad
  - Sistema de mezcla garantizado como solucionable
  - Detección de victoria
  - Sistema de códigos de descuento

### Imágenes
- **images/nordic-room.svg**: Imagen de habitación estilo nórdico
  - Ilustración vectorial con elementos minimalistas
  - Colores claros y naturales
  - Puede ser reemplazada por una fotografía real

## Características Implementadas

### Funcionalidades del Juego

1. **Rompecabezas 4x4**
   - 15 piezas móviles + 1 espacio vacío
   - Mecánica de deslizamiento: solo las piezas adyacentes al espacio vacío pueden moverse
   - Mezcla aleatoria pero siempre solucionable (usa movimientos válidos para garantizarlo)

2. **Contador de Movimientos**
   - Muestra el número total de movimientos realizados
   - Se actualiza en tiempo real
   - Se reinicia al mezclar el puzzle

3. **Temporizador**
   - Formato MM:SS
   - Inicia automáticamente al cargar la página
   - Se detiene al completar el puzzle
   - Se reinicia al mezclar el puzzle

4. **Botón de Reinicio**
   - Mezcla el puzzle nuevamente
   - Reinicia contador de movimientos y temporizador
   - Mantiene el estado del código de descuento

5. **Botón de Ayuda/Pista**
   - Muestra brevemente los números de las piezas durante 2 segundos
   - Ayuda a visualizar el orden correcto sin revelar completamente la solución

6. **Animaciones Suaves**
   - Transiciones CSS para movimiento de hover
   - Animación de pulso al ganar
   - Fade in del modal de éxito
   - Efectos de hover en botones

7. **Diseño Responsive**
   - Adaptable a dispositivos móviles (320px+)
   - Tablets (768px+)
   - Desktop (1200px+)
   - Grid flexible que mantiene proporciones

### Sistema de Códigos de Descuento

#### Generación de Códigos

```javascript
generateDiscountCode() {
  const prefix = 'ECODECOR';
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const code = `${prefix}-${random}`;
  
  // Calcular fecha de expiración (3 meses)
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + 3);
  
  // Guardar en localStorage
  localStorage.setItem('ecodecor_discount_code', code);
  localStorage.setItem('ecodecor_code_expiry', expiryDate.toISOString());
  
  return code;
}
```

#### Formato del Código
- Prefijo: `ECODECOR-`
- Sufijo: 6 caracteres alfanuméricos aleatorios en mayúsculas
- Ejemplo: `ECODECOR-A3F8K2`

#### Almacenamiento en localStorage

El sistema guarda dos valores:

1. **ecodecor_discount_code**: El código de descuento
2. **ecodecor_code_expiry**: Fecha de expiración en formato ISO 8601

#### Restricciones

1. **Un código por usuario**
   - Al completar el puzzle, se verifica si ya existe un código en localStorage
   - Si existe y es válido, se muestra el código existente
   - No se genera un nuevo código si ya hay uno válido

2. **Validez de 3 meses**
   - La fecha de expiración se calcula automáticamente
   - Se verifica al cargar la página y al ganar
   - Los códigos expirados se eliminan automáticamente

3. **Persistencia local**
   - Los datos se guardan en el navegador del usuario
   - Persisten entre sesiones
   - Se pierden si el usuario limpia los datos del navegador

#### Validación

```javascript
checkExistingCode() {
  const savedCode = localStorage.getItem('ecodecor_discount_code');
  const savedExpiry = localStorage.getItem('ecodecor_code_expiry');
  
  if (savedCode && savedExpiry) {
    const expiryDate = new Date(savedExpiry);
    const now = new Date();
    
    if (now < expiryDate) {
      // Código válido
      return true;
    } else {
      // Código expirado - eliminar
      localStorage.removeItem('ecodecor_discount_code');
      localStorage.removeItem('ecodecor_code_expiry');
      return false;
    }
  }
  return false;
}
```

## Integración con el Sitio Web

### Opción 1: Sección en Página Existente

Agregar el contenido de `puzzle.html` como una sección en la página principal:

```html
<!-- En tu index.html -->
<section id="puzzle-section">
  <!-- Contenido del puzzle aquí -->
</section>

<!-- Antes de cerrar </body> -->
<link rel="stylesheet" href="css/puzzle.css">
<script src="js/puzzle.js"></script>
```

### Opción 2: Página Dedicada

Usar `puzzle.html` como página independiente y enlazarla desde el menú principal.

## Personalización

### Cambiar la Imagen

1. Reemplazar `images/nordic-room.svg` o `images/nordic-room.jpg`
2. Mantener proporción 1:1 (cuadrada)
3. Resolución recomendada: 800x800px o superior
4. Asegurarse de que la imagen tenga suficiente contraste y detalles para ser reconocible en 16 piezas

### Modificar Colores

Editar las variables CSS en `css/puzzle.css`:

```css
:root {
  --color-bg: #F5F5DC; /* Color de fondo */
  --color-wood: #D4B896; /* Madera clara */
  --color-sage: #B8C5B0; /* Verde sage */
  --color-text: #2D2D2D; /* Color de texto */
}
```

### Ajustar Dificultad

Para hacer el puzzle más fácil o difícil, cambiar el número de mezclas en `js/puzzle.js`:

```javascript
shufflePuzzle() {
  const shuffleMoves = 200; // Aumentar para más difícil, reducir para más fácil
  // ...
}
```

### Cambiar Descuento

Modificar el texto en el modal de éxito y en el título de la página. El porcentaje es solo informativo y debe implementarse en el sistema de checkout.

### Modificar Período de Validez

Cambiar el número de meses en `js/puzzle.js`:

```javascript
const expiryDate = new Date();
expiryDate.setMonth(expiryDate.getMonth() + 3); // Cambiar 3 por el número deseado
```

## Compatibilidad de Navegadores

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Opera: 76+
- Navegadores móviles modernos

Características usadas:
- CSS Grid
- CSS Custom Properties
- LocalStorage API
- ES6 Classes
- Arrow Functions
- Template Literals

## Accesibilidad

### Mejoras Implementadas

- Contraste de colores cumple WCAG AA
- Tamaños de botón adecuados para touch (min 44x44px)
- Etiquetas semánticas HTML5
- Responsive design

### Mejoras Futuras Sugeridas

Para mejorar la accesibilidad, considerar agregar:

```html
<!-- Atributos ARIA -->
<div class="puzzle-tile" 
     role="button" 
     aria-label="Pieza del rompecabezas número 5"
     tabindex="0">
</div>

<!-- Anuncio de estado -->
<div role="status" aria-live="polite" class="sr-only">
  Has realizado 10 movimientos
</div>
```

## Testing

### Funcionalidades a Probar

1. **Movimiento de piezas**
   - Solo se mueven piezas adyacentes al espacio vacío
   - Las piezas no adyacentes no se mueven al hacer clic
   
2. **Detección de victoria**
   - El puzzle reconoce cuando todas las piezas están en orden
   - El modal aparece correctamente
   
3. **Sistema de códigos**
   - Código se genera al ganar
   - Código se guarda en localStorage
   - No se genera segundo código si ya existe uno válido
   - Código expirado se elimina y permite generar uno nuevo
   
4. **Controles**
   - Botón de reinicio funciona correctamente
   - Botón de ayuda muestra números por 2 segundos
   - Modal se cierra correctamente
   
5. **Responsive**
   - Probar en diferentes tamaños de pantalla
   - Verificar que el puzzle se adapta correctamente

### Testing Manual

```javascript
// Abrir consola del navegador para pruebas

// Ver código guardado
localStorage.getItem('ecodecor_discount_code');

// Ver fecha de expiración
localStorage.getItem('ecodecor_code_expiry');

// Eliminar código (para probar de nuevo)
localStorage.removeItem('ecodecor_discount_code');
localStorage.removeItem('ecodecor_code_expiry');

// Simular código expirado
const pastDate = new Date();
pastDate.setMonth(pastDate.getMonth() - 1);
localStorage.setItem('ecodecor_code_expiry', pastDate.toISOString());
```

## Mantenimiento

### Limpieza de Códigos Expirados

El sistema limpia automáticamente los códigos expirados cuando:
1. El usuario carga la página
2. El usuario completa el puzzle

No se requiere limpieza manual.

### Actualizar Imagen

1. Crear nueva imagen cuadrada
2. Guardar en `images/`
3. Actualizar la referencia en `js/puzzle.js`:

```javascript
tileElement.style.backgroundImage = 'url(images/nueva-imagen.jpg)';
```

## Seguridad

### Consideraciones

1. **localStorage**: Los datos se almacenan en el navegador del cliente
   - No es seguro para información sensible
   - Apropiado para códigos promocionales de bajo valor
   
2. **Validación del código**: El código generado es solo para el frontend
   - Debe validarse en el backend al aplicar el descuento
   - Implementar lista de códigos válidos en el servidor
   - Verificar que el código no haya sido usado previamente

### Recomendaciones para Producción

1. **Backend Integration**:
   ```javascript
   // Enviar código al servidor al generarlo
   async function saveDiscountCode(code) {
     await fetch('/api/discount-codes', {
       method: 'POST',
       body: JSON.stringify({ code, userId, expiryDate })
     });
   }
   ```

2. **Validación en Checkout**:
   - Verificar en el servidor que el código existe
   - Confirmar que no ha expirado
   - Verificar que no ha sido usado
   - Asociar con el usuario actual

## Soporte

Para problemas o preguntas sobre la implementación, revisar:

1. Consola del navegador para errores de JavaScript
2. Herramientas de desarrollo para problemas de CSS
3. localStorage en Application tab para depurar códigos

## Licencia

Este código es propiedad de Ecodecor y está destinado para uso exclusivo en el sitio web de Ecodecor.
