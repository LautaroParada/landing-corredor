'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Home, Menu, X, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, MessageCircle, Youtube } from 'lucide-react';

const DopDopLanding = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Environment variables simulation
  const WHATSAPP_NUMBER = '56912345678'; // Replace with actual number
  const EMAIL = 'contacto@dopdop.cl';
  const PHONE = '+56 9 1234 5678';
  const ADDRESS = 'Santiago, Chile';

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const handleWhatsApp = (message) => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmail = (subject) => {
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
  };

  const navItems = [
    { id: 'quienes-somos', label: 'Quiénes Somos' },
    { id: 'venta', label: 'Venta' },
    { id: 'arriendo', label: 'Arriendo' },
    { id: 'tasacion', label: 'Tasación' },
    { id: 'administracion', label: 'Administración' },
    { id: 'contacto', label: 'Contacto' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header / Navbar */}
      <header className="glass-surface fixed top-0 w-full bg-black/95 backdrop-blur-sm z-50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Home className="w-7 h-7" style={{ color: 'var(--color-brand)' }} />
              <span className="text-white text-2xl font-bold">DopDop</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                  style={{ ':hover': { color: '#010194' } }}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left py-3 text-gray-300 hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/santiago-portada.jpg"
            alt="Vista de Santiago de Chile — DopDop Corredora de Propiedades"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-transparent"></div>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(1,1,148,0.3) 0%, rgba(0,0,0,0.7) 100%)' }}></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-6 z-10 text-white">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-8xl font-bold mb-4">DopDop</h1>
            <h2 className="text-3xl md:text-5xl font-light mb-8" >
              Don&apos;t OverPay / No Pagues de más
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Nuestro compromiso principal es proteger tu patrimonio a través de la eficiencia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => handleWhatsApp('Hola, me gustaría obtener más información sobre DopDop')}
                className="flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ backgroundColor: 'var(--color-brand)', outlineColor: 'var(--color-brand)' }}
              >
                <MessageCircle className="w-5 h-5" />
                Hablar con un experto
              </button>
              <button
                onClick={() => scrollToSection('servicios')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg border border-white/30 hover:bg-white/20 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Ver servicios
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quiénes Somos */}
      <section id="quienes-somos" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-black">¿Quiénes somos?</h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Somos la primera corredora de propiedades Low-Cost de Chile. Nacimos para terminar con las comisiones del 2%, 10% y 50% que hoy no tienen justificación técnica. En DopDop utilizamos tecnología de vanguardia para eliminar ineficiencias y traspasar ese ahorro directamente a nuestros clientes. <span className="font-bold">No cobramos barato, cobramos lo justo.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Nuestros Servicios Title */}
      <section id="servicios" className="py-12 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-black">Nuestros Servicios</h2>
        </div>
      </section>

      {/* Venta */}
      <section id="venta" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: 'var(--color-brand)' }}>
              Venta de Propiedades (Plan Propiedades)
            </h3>
            
            <div className="space-y-4 mb-8">
              <ServiceItem text="Publicación en portales premium: Tu propiedad donde todos la buscan." />
              <ServiceItem text="Selección de interesados: Filtramos a los compradores reales mediante pre-evaluación comercial." />
              <ServiceItem text="Gestión legal completa: Redacción de promesas y acompañamiento hasta la escritura." />
              <ServiceItem text="Costo: 60 UF (Precio único) sin importar el valor de la propiedad." />
              <ServiceItem text="Beneficio DopDop: 0% de comisión para quien compra. (Esto acelera tu venta)." />
              <ServiceItem text="Nuestros valores incluyen IVA" bold />
            </div>

            <div className="bg-linear-to-r from-blue-50 to-blue-100 border-l-4 p-6 mb-8 rounded-r-lg" style={{ borderLeftColor: 'var(--color-border-brand)' }}>
              <p className="text-lg font-semibold text-gray-800">
                En una propiedad de 5.000 UF, ahorras 40 UF con nosotros comparado con el 2% tradicional
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleWhatsApp('Hola, me interesa el Plan de Venta de Propiedades')}
                className="flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                <MessageCircle className="w-5 h-5" />
                Contactar por WhatsApp
              </button>
              <button
                onClick={() => handleEmail('Consulta: Plan de Venta de Propiedades')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Enviar Email
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Arriendo */}
      <section id="arriendo" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--color-brand)' }}>
              Arriendo de Propiedades
            </h3>
            <p className="text-xl text-gray-700 mb-8">
              Encontramos al arrendatario ideal de forma rápida y segura.
            </p>
            
            <div className="space-y-4 mb-8">
              <ServiceItem text="Evaluación de riesgo: Análisis exhaustivo de antecedentes financieros y comerciales." />
              <ServiceItem text="Contratos digitales: Agilidad y respaldo legal en cada firma." />
              <ServiceItem text="Costo: 15 UF (Precio único)." />
              <ServiceItem text="Beneficio DopDop: 0 ($/UF) de comisión para quien arrienda. (Tendrás tres veces más postulantes para elegir al mejor)." />
              <ServiceItem text="Nuestros valores incluyen IVA." bold />
            </div>

            <div className="bg-linear-to-r from-blue-50 to-blue-100 border-l-4 p-6 mb-8 rounded-r-lg" style={{ borderLeftColor: 'var(--color-border-brand)' }}>
              <p className="text-lg font-semibold text-gray-800">
                Al no cobrar comisión al arrendatario, atraemos a 3 veces más interesados. Esto te permite ser mucho más exigente en la evaluación de antecedentes y encontrar al arrendatario ideal más rápido.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleWhatsApp('Hola, me interesa el Plan de Arriendo')}
                className="flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                <MessageCircle className="w-5 h-5" />
                Contactar por WhatsApp
              </button>
              <button
                onClick={() => handleEmail('Consulta: Plan de Arriendo')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Enviar Email
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tasación */}
      <section id="tasacion" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--color-brand)' }}>
              Tasación Inteligente
            </h3>
            <p className="text-xl text-gray-700 mb-8">
              No adivinamos el precio, lo calculamos con datos.
            </p>
            
            <div className="space-y-4 mb-8">
              <ServiceItem text="Utilizamos algoritmos de Inteligencia Artificial para analizar el mercado en tiempo real." />
              <ServiceItem text="Obtén el precio óptimo para vender o arrendar rápido, sin perder dinero." />
              <ServiceItem text="Incluido gratis en todos nuestros planes de corretaje." />
              <ServiceItem text="Nuestros valores incluyen IVA." bold />
            </div>

            <div className="bg-linear-to-r from-blue-50 to-blue-100 border-l-4 p-6 rounded-r-lg" style={{ borderLeftColor: 'var(--color-border-brand)' }}>
              <p className="text-lg font-semibold text-gray-800">
                No adivinamos el precio de tu propiedad. Usamos tecnología para encontrar el &apos;sweet spot&apos; (punto óptimo) que maximiza tu ganancia sin castigar la velocidad de cierre.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => handleWhatsApp('Hola, me interesa el servicio de Tasación Inteligente')}
                className="flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                <MessageCircle className="w-5 h-5" />
                Contactar por WhatsApp
              </button>
              <button
                onClick={() => handleEmail('Consulta: Tasación Inteligente')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Enviar Email
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Administración */}
      <section id="administracion" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--color-brand)' }}>
              Administración de Propiedades
            </h3>
            <p className="text-xl text-gray-700 mb-8">
              Libérate de las tareas operativas y asegura tu rentabilidad con un costo fijo.
            </p>
            
            <div className="space-y-4 mb-8">
              <ServiceItem text="Recaudación puntual: Gestión automatizada de cobros para que recibas tu dinero sin retrasos." />
              <ServiceItem text="Gestión de incidencias: Filtramos y resolvemos problemas de mantenimiento con técnicos verificados sin sobreprecio." />
              <ServiceItem text="Seguimiento Digital: Acceso a un dashboard donde puedes ver el estado de tus pagos y documentos 24/7." />
              <ServiceItem text="Protección Legal: Asesoría constante para renovaciones, reajustes de IPC y términos de contrato." />
              <ServiceItem text="Costo: 1,5 UF (Precio único mensual)." />
              <ServiceItem text="Beneficio DopDop: Sin porcentajes variables. Si sube el valor de tu arriendo, tu costo de administración se mantiene fijo." />
              <ServiceItem text="Nuestros valores incluyen IVA." bold />
            </div>

            <div className="bg-linear-to-r from-blue-50 to-blue-100 border-l-4 p-6 mb-8 rounded-r-lg" style={{ borderLeftColor: 'var(--color-border-brand)' }}>
              <p className="text-lg font-semibold text-gray-800">
                ¿Por qué pagar más si tu propiedad vale más? En el modelo tradicional, si tu arriendo sube, tu corredor gana más. En DopDop el esfuerzo es el mismo, por eso el precio es el mismo: 1,5 UF siempre. Sin porcentajes, sin sorpresas.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleWhatsApp('Hola, me interesa el Plan de Administración')}
                className="flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                <MessageCircle className="w-5 h-5" />
                Contactar por WhatsApp
              </button>
              <button
                onClick={() => handleEmail('Consulta: Plan de Administración')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Enviar Email
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-black">Contacto</h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-12">
              Nuestro compromiso principal es proteger tu patrimonio a través de la eficiencia. Transformamos la experiencia de venta y arriendo en un proceso justo, transparente y moderno, eliminando comisiones excesivas para que el valor de tu propiedad se quede donde siempre debió estar: en tus manos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleWhatsApp('Hola, me gustaría obtener más información sobre DopDop')}
                className="flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--color-brand)' }}
              >
                <MessageCircle className="w-5 h-5" />
                Conversemos por WhatsApp
              </button>
              <button
                onClick={() => handleEmail('Consulta General')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Mail className="w-5 h-5" />
                Escríbenos un Email
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Home className="w-6 h-6 text-blue-400" />
                <span className="text-white text-lg font-bold">DopDop</span>
              </div>
              <p className="text-sm leading-relaxed">
                Nuestro compromiso es devolverle el control al propietario. Redefinimos la experiencia inmobiliaria combinando tecnología de vanguardia con un modelo de costo fijo, asegurando que cada transacción sea un paso hacia adelante en tu rentabilidad, sin letras chicas ni cobros injustificados.
              </p>
            </div>

            {/* Servicios */}
            <div>
              <h4 className="text-white font-bold mb-4">Servicios</h4>
              <ul className="space-y-2">
                {['Venta', 'Arriendo', 'Tasación', 'Administración'].map((service) => (
                  <li key={service}>
                    <button
                      onClick={() => scrollToSection(service.toLowerCase())}
                      className="hover:text-white transition-colors text-left"
                    >
                      {service}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="text-white font-bold mb-4">Contacto</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${EMAIL}`} className="hover:text-white transition-colors">
                    {EMAIL}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{PHONE}</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{ADDRESS}</span>
                </li>
              </ul>
            </div>

            {/* Redes Sociales */}
            <div>
              <h4 className="text-white font-bold mb-4">Síguenos en:</h4>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="hover:text-white transition-colors" aria-label="WhatsApp">
                  <MessageCircle className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-white transition-colors" aria-label="YouTube">
                  <Youtube className="w-6 h-6" />
                </a>
                <a href="#" className="hover:text-white transition-colors" aria-label="TikTok">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} DopDop. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ServiceItem = ({ text, bold = false }) => (
  <div className="flex items-start gap-3">
    <span className="mt-1" style={{ color: 'var(--color-success)' }}>✓</span>
    <p className={`text-gray-700 ${bold ? 'font-semibold' : ''}`}>{text}</p>
  </div>
);

export default DopDopLanding;