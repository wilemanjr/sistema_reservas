export class ReservaBuilder {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.reserva = {
      tipo: null,
      cliente: '',
      fechaInicio: null,
      fechaFin: null,
      precioBase: 0,
    };
    return this;
  }
  
  setTipo(tipo) {
    this.reserva.tipo = tipo;
    return this;
  }
  
  setCliente(cliente) {
    this.reserva.cliente = cliente;
    return this;
  }
  
  setFechas(inicio, fin) {
    this.reserva.fechaInicio = inicio;
    this.reserva.fechaFin = fin;
    return this;
  }
  
  setPrecioBase(precio) {
    this.reserva.precioBase = precio;
    return this;
  }
  
  setHotelData(nombreHotel, tipoHabitacion, numeroHuespedes, desayuno, estacionamiento) {
    this.reserva.nombreHotel = nombreHotel;
    this.reserva.tipoHabitacion = tipoHabitacion;
    this.reserva.numeroHuespedes = numeroHuespedes;
    this.reserva.incluyeDesayuno = desayuno;
    this.reserva.incluyeEstacionamiento = estacionamiento;
    return this;
  }
  
  setVueloData(aerolinea, numeroVuelo, origen, destino, clase, pasajeros, idaVuelta) {
    this.reserva.aerolinea = aerolinea;
    this.reserva.numeroVuelo = numeroVuelo;
    this.reserva.origen = origen;
    this.reserva.destino = destino;
    this.reserva.clase = clase;
    this.reserva.numPasajeros = pasajeros;
    this.reserva.idaVuelta = idaVuelta;
    return this;
  }
  
  setRestauranteData(nombre, personas, tipoMesa, ocasion, menuInfantil, restricciones) {
    this.reserva.nombreRestaurante = nombre;
    this.reserva.numeroPersonas = personas;
    this.reserva.tipoMesa = tipoMesa;
    this.reserva.ocasEspecial = ocasion;
    this.reserva.requiereMenuInfantil = menuInfantil;
    this.reserva.restriccionesAlimenticias = restricciones;
    return this;
  }
  
  build() {
    if (!this.reserva.tipo) {
      throw new Error('Debe especificar el tipo de reserva');
    }
    if (!this.reserva.cliente) {
      throw new Error('Debe especificar el cliente');
    }
    console.log('🔨 [Builder] Reserva construida:', this.reserva);
    return this.reserva;
  }
}

export class ReservaDirector {
  static crearReservaEstandar(builder, tipo, cliente) {
    return builder
      .reset()
      .setTipo(tipo)
      .setCliente(cliente)
      .setPrecioBase(100)
      .build();
  }
  
  static crearReservaLujo(builder, tipo, cliente) {
    const reserva = builder
      .reset()
      .setTipo(tipo)
      .setCliente(cliente)
      .setPrecioBase(500);
    
    if (tipo === 'HOTEL') {
      reserva.setHotelData('Hotel Lujo', 'SUITE', 2, true, true);
    } else if (tipo === 'RESTAURANTE') {
      reserva.setRestauranteData('Restaurante Gourmet', 2, 'VIP', 'ANIVERSARIO', false, '');
    }
    
    return reserva.build();
  }
}