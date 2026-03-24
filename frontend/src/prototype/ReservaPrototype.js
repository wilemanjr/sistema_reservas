export class ReservaPrototype {
  constructor(reserva) {
    this.original = reserva;
    console.log('📋 [Prototype] Prototipo creado para reserva ID:', reserva?.id);
  }
  
  clonar() {
    const clon = JSON.parse(JSON.stringify(this.original));
    console.log('📋 [Prototype] Reserva clonada:', clon.id || 'nueva');
    return clon;
  }
  
  clonarConModificaciones(modificaciones) {
    const clon = this.clonar();
    const resultado = { ...clon, ...modificaciones };
    console.log('📋 [Prototype] Clon con modificaciones:', modificaciones);
    return resultado;
  }
}

export class ReservaPrototypeManager {
  static prototypes = new Map();
  
  static registrarPrototipo(key, reserva) {
    this.prototypes.set(key, new ReservaPrototype(reserva));
    console.log(`📋 [Prototype] Prototipo registrado: ${key}`);
  }
  
  static obtenerPrototipo(key) {
    const prototype = this.prototypes.get(key);
    if (!prototype) {
      throw new Error(`Prototipo no encontrado: ${key}`);
    }
    return prototype;
  }
  
  static clonarReserva(key, modificaciones = {}) {
    const prototype = this.obtenerPrototipo(key);
    return prototype.clonarConModificaciones(modificaciones);
  }
  
  static eliminarPrototipo(key) {
    this.prototypes.delete(key);
    console.log(`📋 [Prototype] Prototipo eliminado: ${key}`);
  }
}