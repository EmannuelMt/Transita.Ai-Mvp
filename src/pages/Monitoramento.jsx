<<<<<<< HEAD
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  FiTruck, FiRefreshCw, FiMap, FiPhone, FiBarChart2,
  FiSmartphone, FiNavigation, FiClock, FiThermometer,
  FiDroplet, FiActivity, FiUser, FiCalendar, FiAlertCircle,
  FiCheckCircle, FiSettings, FiPlay, FiPause, FiFlag
} from 'react-icons/fi';
import { 
  MdSatellite, MdTraffic, MdLocationOn, MdMyLocation,
  MdSpeed, MdLocalGasStation, MdDirectionsCar
} from 'react-icons/md';
import { 
  IoStatsChart, IoSpeedometerOutline, IoTimeOutline, IoNavigateOutline
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
console.log("Google Maps Key:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
import './Monitoramento.css';

// Configurações da API
const API_CONFIG = {
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  FLEET_API_BASE_URL: import.meta.env.VITE_FLEET_API_BASE_URL
};

// Componente do Mapa do Google
const MapComponent = ({ 
  selectedVehicle, 
  vehicles, 
  center, 
  zoom = 10,
  onMapClick,
  onMarkerClick 
}) => {
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center: center || { lat: -23.5505, lng: -46.6333 },
        zoom,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#c9c9c9" }]
          }
        ]
      });

      setMap(newMap);
      setDirectionsService(new window.google.maps.DirectionsService());
      setDirectionsRenderer(new window.google.maps.DirectionsRenderer({
        map: newMap,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#3b82f6',
          strokeOpacity: 0.8,
          strokeWeight: 6
        }
      }));
    }
  }, [ref, map, center, zoom]);

  // Atualizar marcadores dos veículos
  useEffect(() => {
    if (!map) return;

    // Limpar marcadores antigos
    markers.forEach(marker => marker.setMap(null));

    const newMarkers = vehicles.map(vehicle => {
      const position = vehicle.position || getVehiclePosition(vehicle);

      const marker = new window.google.maps.Marker({
        position,
        map,
        title: `${vehicle.placa} - ${vehicle.motorista}`,
        icon: {
          url: getVehicleIcon(vehicle),
          scaledSize: new window.google.maps.Size(32, 32),
        }
      });

      marker.addListener('click', () => {
        onMarkerClick(vehicle);
      });

      return marker;
    });

    setMarkers(newMarkers);
  }, [map, vehicles]);

  // Calcular rota quando um veículo é selecionado
  useEffect(() => {
    if (!selectedVehicle || !directionsService || !directionsRenderer) return;

    const origin = { lat: -23.5505, lng: -46.6333 };
    const destination = getDestinationCoordinates(selectedVehicle.destino);

    directionsService.route({
      origin,
      destination,
      travelMode: window.google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
        
        const vehiclePosition = selectedVehicle.position || getVehiclePosition(selectedVehicle);
        map.setCenter(vehiclePosition);
        map.setZoom(12);
      }
    });
  }, [selectedVehicle, directionsService, directionsRenderer, map]);
const getVehicleIcon = (vehicle) => {
  const statusColor = getStatusColor(vehicle.status);
  
  const svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="${statusColor}" stroke="white" stroke-width="2"/>
      <text x="16" y="20" text-anchor="middle" fill="white" font-size="12">🚚</text>
    </svg>
  `;

  // Codifica corretamente o SVG pra UTF-8 antes do btoa
  const base64 = btoa(unescape(encodeURIComponent(svg)));

  return `data:image/svg+xml;base64,${base64}`;
};

const getStatusColor = (status) => {
  const colors = {
    'em_viagem': '#10B981',
    'carregando': '#F59E0B',
    'descanso': '#6B7280', 
    'manutencao': '#EF4444',
    'parado': '#3B82F6'
  };
  return colors[status] || '#6B7280';
};

  const getVehiclePosition = (vehicle) => {
    return {
      lat: -23.5505 + (vehicle.id * 0.01),
      lng: -46.6333 + (vehicle.id * 0.01)
    };
  };

  const getDestinationCoordinates = (destino) => {
    const destinations = {
      'Rio de Janeiro - RJ': { lat: -22.9068, lng: -43.1729 },
      'Brasília - DF': { lat: -15.7975, lng: -47.8919 },
      'Porto Alegre - RS': { lat: -30.0346, lng: -51.2177 },
      'Belo Horizonte - MG': { lat: -19.9191, lng: -43.9386 },
      'São Paulo - SP': { lat: -23.5505, lng: -46.6333 }
    };
    return destinations[destino] || { lat: -23.5505, lng: -46.6333 };
  };

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
};

// Componente de renderização do mapa
const MapRenderer = ({ status }) => {
  if (status === Status.LOADING) {
    return (
      <div className="map-loading">
        <div className="map-loading-spinner">
          <FiNavigation />
        </div>
        <p>Carregando mapa...</p>
      </div>
    );
  }

  if (status === Status.FAILURE) {
    return (
      <div className="map-error">
        <FiAlertCircle />
        <p>Erro ao carregar o mapa</p>
        <p style={{ fontSize: '0.875rem', marginTop: 'var(--space-sm)' }}>
          Verifique sua chave da API do Google Maps
        </p>
      </div>
    );
  }

  return null;
};

// Serviço de API Real
class FleetMonitoringService {
  constructor() {
    this.baseURL = API_CONFIG.FLEET_API_BASE_URL;
  }

  async getVehicles() {
    try {
      // Simulação de API real
      return await this.mockGetVehicles();
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      throw error;
    }
  }

  async getVehiclePosition(vehicleId) {
    try {
      return await this.mockGetVehiclePosition(vehicleId);
    } catch (error) {
      console.error('Erro ao buscar posição:', error);
      throw error;
    }
  }

  async getRoute(origin, destination) {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${API_CONFIG.GOOGLE_MAPS_API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao calcular rota:', error);
      // Retorna dados mock em caso de erro
      return this.mockGetRoute(origin, destination);
    }
  }

  async sendCommand(vehicleId, command) {
    try {
      return await this.mockSendCommand(vehicleId, command);
    } catch (error) {
      console.error('Erro ao enviar comando:', error);
      throw error;
    }
  }

  // Métodos mock para simulação
  async mockGetVehicles() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            placa: 'ABC1I23',
            modelo: 'Volvo FH 540',
            motorista: 'Carlos Santos',
            status: 'em_viagem',
            localizacao: 'Rodovia Presidente Dutra, KM 42',
            destino: 'Rio de Janeiro - RJ',
            velocidade: 78,
            combustivel: 85,
            temperatura: 18,
            odometro: 125420,
            tempo_viagem: '2:45',
            ultimaAtualizacao: new Date(Date.now() - 120000),
            carga: 'Eletrônicos',
            peso: 15.2,
            efficiency: 2.8,
            nextMaintenance: 5000,
            alerts: ['manutencao_proxima'],
            routeProgress: 65,
            position: { lat: -23.1234, lng: -46.5678 }
          },
          {
            id: 2,
            placa: 'DEF4G56',
            modelo: 'Scania R440',
            motorista: 'Maria Oliveira',
            status: 'carregando',
            localizacao: 'Centro de Distribuição - SP',
            destino: 'Brasília - DF',
            velocidade: 0,
            combustivel: 92,
            temperatura: 22,
            odometro: 89230,
            tempo_viagem: '0:00',
            ultimaAtualizacao: new Date(Date.now() - 300000),
            carga: 'Alimentos',
            peso: 8.7,
            efficiency: 3.1,
            nextMaintenance: 12000,
            alerts: [],
            routeProgress: 0,
            position: { lat: -23.5405, lng: -46.6433 }
          },
          {
            id: 3,
            placa: 'GHI7J89',
            modelo: 'Mercedes Actros 2651',
            motorista: 'Pedro Costa',
            status: 'em_viagem',
            localizacao: 'BR-116, KM 128',
            destino: 'Porto Alegre - RS',
            velocidade: 82,
            combustivel: 68,
            temperatura: 16,
            odometro: 156780,
            tempo_viagem: '4:20',
            ultimaAtualizacao: new Date(Date.now() - 60000),
            carga: 'Automotivos',
            peso: 22.1,
            efficiency: 2.5,
            nextMaintenance: 2500,
            alerts: ['combustivel_baixo'],
            routeProgress: 45,
            position: { lat: -23.5605, lng: -46.6533 }
          },
          {
            id: 4,
            placa: 'JKL0M12',
            modelo: 'Ford Cargo 2428',
            motorista: 'Ana Rodrigues',
            status: 'manutencao',
            localizacao: 'Oficina Central',
            destino: 'São Paulo - SP',
            velocidade: 0,
            combustivel: 45,
            temperatura: 25,
            odometro: 234560,
            tempo_viagem: '0:00',
            ultimaAtualizacao: new Date(Date.now() - 1800000),
            carga: 'Vazio',
            peso: 0,
            efficiency: 2.9,
            nextMaintenance: 0,
            alerts: ['em_manutencao'],
            routeProgress: 0,
            position: { lat: -23.5705, lng: -46.6633 }
          },
          {
            id: 5,
            placa: 'MNO3P45',
            modelo: 'DAF XF 480',
            motorista: 'Roberto Silva',
            status: 'descanso',
            localizacao: 'Posto de Descanso - MG',
            destino: 'Belo Horizonte - MG',
            velocidade: 0,
            combustivel: 78,
            temperatura: 20,
            odometro: 189230,
            tempo_viagem: '0:00',
            ultimaAtualizacao: new Date(Date.now() - 900000),
            carga: 'Têxteis',
            peso: 12.5,
            efficiency: 2.7,
            nextMaintenance: 8000,
            alerts: [],
            routeProgress: 0,
            position: { lat: -23.5805, lng: -46.6733 }
          }
        ]);
      }, 500);
    });
  }

  async mockGetVehiclePosition(vehicleId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          lat: -23.5505 + (vehicleId * 0.01),
          lng: -46.6333 + (vehicleId * 0.01),
          timestamp: new Date()
        });
      }, 200);
    });
  }

  async mockGetRoute(origin, destination) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          routes: [{
            legs: [{
              distance: { text: '450 km', value: 450000 },
              duration: { text: '5 horas', value: 18000 },
              steps: []
            }]
          }]
        });
      }, 300);
    });
  }

  async mockSendCommand(vehicleId, command) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, command, vehicleId, timestamp: new Date() });
      }, 300);
    });
  }
}

// Componente Principal
=======
import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiTruck, 
  FiRefreshCw, 
  FiMap, 
  FiPhone, 
  FiBarChart2,
  FiSmartphone,
  FiNavigation,
  FiClock,
  FiThermometer,
  FiDroplet,
  FiActivity,
  FiUser,
  FiCalendar,
  FiAlertCircle,
  FiCheckCircle,
  FiSettings,
  FiPlay,
  FiPause,
  FiFlag
} from 'react-icons/fi';
import { 
  MdSatellite, 
  MdTraffic, 
  MdLocationOn,
  MdMyLocation,
  MdSpeed,
  MdLocalGasStation,
  MdDirectionsCar
} from 'react-icons/md';
import { 
  IoStatsChart,
  IoSpeedometerOutline,
  IoTimeOutline,
  IoNavigateOutline
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import './Monitoramento.css';

>>>>>>> 9d410153e6b110099f48b9ce892147f5ef75f43f
const Monitoramento = ({ user, onNavigate }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [mapView, setMapView] = useState('standard');
  const [autoRefresh, setAutoRefresh] = useState(true);
<<<<<<< HEAD
  const [mapCenter, setMapCenter] = useState({ lat: -23.5505, lng: -46.6333 });
  const [mapZoom, setMapZoom] = useState(10);
  const [mapError, setMapError] = useState(false);

  const monitoringService = useRef(new FleetMonitoringService());

  // Configurações de status
=======

  // Simulação de dados em tempo real
  useEffect(() => {
    const initialVehicles = [
      {
        id: 1,
        placa: 'ABC1I23',
        modelo: 'Volvo FH 540',
        motorista: 'Carlos Santos',
        status: 'em_viagem',
        localizacao: 'Rodovia Presidente Dutra, KM 42',
        destino: 'Rio de Janeiro - RJ',
        velocidade: 78,
        combustivel: 85,
        temperatura: 18,
        odometro: 125420,
        tempo_viagem: '2:45',
        ultimaAtualizacao: new Date(Date.now() - 120000),
        carga: 'Eletrônicos',
        peso: 15.2,
        efficiency: 2.8,
        nextMaintenance: 5000,
        alerts: ['manutencao_proxima'],
        routeProgress: 65
      },
      {
        id: 2,
        placa: 'DEF4G56',
        modelo: 'Scania R440',
        motorista: 'Maria Oliveira',
        status: 'carregando',
        localizacao: 'Centro de Distribuição - SP',
        destino: 'Brasília - DF',
        velocidade: 0,
        combustivel: 92,
        temperatura: 22,
        odometro: 89230,
        tempo_viagem: '0:00',
        ultimaAtualizacao: new Date(Date.now() - 300000),
        carga: 'Alimentos',
        peso: 8.7,
        efficiency: 3.1,
        nextMaintenance: 12000,
        alerts: [],
        routeProgress: 0
      },
      {
        id: 3,
        placa: 'GHI7J89',
        modelo: 'Mercedes Actros 2651',
        motorista: 'Pedro Costa',
        status: 'em_viagem',
        localizacao: 'BR-116, KM 128',
        destino: 'Porto Alegre - RS',
        velocidade: 82,
        combustivel: 68,
        temperatura: 16,
        odometro: 156780,
        tempo_viagem: '4:20',
        ultimaAtualizacao: new Date(Date.now() - 60000),
        carga: 'Automotivos',
        peso: 22.1,
        efficiency: 2.5,
        nextMaintenance: 2500,
        alerts: ['combustivel_baixo'],
        routeProgress: 45
      },
      {
        id: 4,
        placa: 'JKL0M12',
        modelo: 'Ford Cargo 2428',
        motorista: 'Ana Rodrigues',
        status: 'manutencao',
        localizacao: 'Oficina Central',
        destino: 'São Paulo - SP',
        velocidade: 0,
        combustivel: 45,
        temperatura: 25,
        odometro: 234560,
        tempo_viagem: '0:00',
        ultimaAtualizacao: new Date(Date.now() - 1800000),
        carga: 'Vazio',
        peso: 0,
        efficiency: 2.9,
        nextMaintenance: 0,
        alerts: ['em_manutencao'],
        routeProgress: 0
      },
      {
        id: 5,
        placa: 'MNO3P45',
        modelo: 'DAF XF 480',
        motorista: 'Roberto Silva',
        status: 'descanso',
        localizacao: 'Posto de Descanso - MG',
        destino: 'Belo Horizonte - MG',
        velocidade: 0,
        combustivel: 78,
        temperatura: 20,
        odometro: 189230,
        tempo_viagem: '0:00',
        ultimaAtualizacao: new Date(Date.now() - 900000),
        carga: 'Têxteis',
        peso: 12.5,
        efficiency: 2.7,
        nextMaintenance: 8000,
        alerts: [],
        routeProgress: 0
      }
    ];

    setVehicles(initialVehicles);
    setIsLoading(false);
    
    // Simula atualização em tempo real
    const interval = setInterval(() => {
      if (autoRefresh) {
        setVehicles(prev => prev.map(vehicle => ({
          ...vehicle,
          ultimaAtualizacao: new Date(),
          velocidade: vehicle.status === 'em_viagem' 
            ? Math.max(0, vehicle.velocidade + (Math.random() - 0.5) * 10)
            : 0,
          combustivel: Math.max(5, vehicle.combustivel - (Math.random() * 0.1)),
          routeProgress: vehicle.status === 'em_viagem' 
            ? Math.min(100, vehicle.routeProgress + (Math.random() * 2))
            : vehicle.routeProgress
        })));
        setLastUpdate(new Date());
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

>>>>>>> 9d410153e6b110099f48b9ce892147f5ef75f43f
  const statusConfig = {
    'em_viagem': { 
      label: 'Em Viagem', 
      color: 'var(--success)',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      icon: <FiNavigation />
    },
    'carregando': { 
      label: 'Carregando', 
      color: 'var(--warning)',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      icon: <FiActivity />
    },
    'descanso': { 
      label: 'Em Descanso', 
      color: 'var(--gray-600)',
      bgColor: 'rgba(107, 114, 128, 0.1)',
      icon: <FiClock />
    },
    'manutencao': { 
      label: 'Manutenção', 
      color: 'var(--error)',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      icon: <FiSettings />
    },
    'parado': { 
      label: 'Parado', 
      color: 'var(--primary)',
      bgColor: 'rgba(99, 102, 241, 0.1)',
      icon: <FiPause />
    }
  };

  const alertConfig = {
    'combustivel_baixo': { label: 'Combustível Baixo', color: 'var(--error)', icon: <FiDroplet /> },
    'manutencao_proxima': { label: 'Manutenção Próxima', color: 'var(--warning)', icon: <FiSettings /> },
    'em_manutencao': { label: 'Em Manutenção', color: 'var(--error)', icon: <FiAlertCircle /> },
    'temperatura_alta': { label: 'Temperatura Alta', color: 'var(--error)', icon: <FiThermometer /> }
  };

<<<<<<< HEAD
  // Carregar dados iniciais
  useEffect(() => {
    loadVehicles();
    
    const realTimeInterval = setInterval(() => {
      if (autoRefresh) {
        updateVehiclePositions();
      }
    }, 5000);

    return () => clearInterval(realTimeInterval);
  }, [autoRefresh]);

  const loadVehicles = async () => {
    try {
      setIsLoading(true);
      const vehiclesData = await monitoringService.current.getVehicles();
      setVehicles(vehiclesData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      alert('Erro ao carregar dados da frota');
    } finally {
      setIsLoading(false);
    }
  };

  const updateVehiclePositions = async () => {
    try {
      const updatedVehicles = await Promise.all(
        vehicles.map(async (vehicle) => {
          if (vehicle.status === 'em_viagem') {
            const position = await monitoringService.current.getVehiclePosition(vehicle.id);
            return {
              ...vehicle,
              position: position,
              velocidade: Math.max(0, vehicle.velocidade + (Math.random() - 0.5) * 5),
              combustivel: Math.max(5, vehicle.combustivel - (Math.random() * 0.05)),
              routeProgress: Math.min(100, vehicle.routeProgress + (Math.random() * 1)),
              ultimaAtualizacao: new Date()
            };
          }
          return vehicle;
        })
      );
      setVehicles(updatedVehicles);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao atualizar posições:', error);
    }
  };

  const handleContactDriver = async (vehicle) => {
    try {
      const result = await monitoringService.current.sendCommand(vehicle.id, 'contact_driver');
      if (result.success) {
        alert(`Comando enviado para contatar ${vehicle.motorista} (${vehicle.placa})`);
      }
    } catch (error) {
      console.error('Erro ao contatar motorista:', error);
      alert('Erro ao enviar comando');
    }
  };

  const handleViewRoute = async (vehicle) => {
    try {
      const route = await monitoringService.current.getRoute(
        'São Paulo, SP',
        vehicle.destino
      );
      setSelectedVehicle(vehicle);
    } catch (error) {
      console.error('Erro ao calcular rota:', error);
      alert('Erro ao calcular rota');
    }
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    if (vehicle.position) {
      setMapCenter(vehicle.position);
      setMapZoom(12);
    }
  };

  const handleMapMarkerClick = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await loadVehicles();
    setTimeout(() => setIsLoading(false), 1000);
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  // Filtros e estatísticas
=======
>>>>>>> 9d410153e6b110099f48b9ce892147f5ef75f43f
  const filters = [
    { key: 'todos', label: 'Todos', icon: <FiTruck />, count: vehicles.length },
    { key: 'em_viagem', label: 'Em Viagem', icon: <FiNavigation />, count: vehicles.filter(v => v.status === 'em_viagem').length },
    { key: 'manutencao', label: 'Manutenção', icon: <FiSettings />, count: vehicles.filter(v => v.status === 'manutencao').length },
    { key: 'alertas', label: 'Com Alertas', icon: <FiAlertCircle />, count: vehicles.filter(v => v.alerts.length > 0).length }
  ];

  const filteredVehicles = useMemo(() => {
    if (activeFilter === 'todos') return vehicles;
    if (activeFilter === 'alertas') return vehicles.filter(v => v.alerts.length > 0);
    return vehicles.filter(v => v.status === activeFilter);
  }, [vehicles, activeFilter]);

  const stats = [
    {
      value: vehicles.length,
      label: 'Veículos Totais',
      icon: <FiTruck />,
      color: 'blue',
      change: '+2'
    },
    {
      value: vehicles.filter(v => v.status === 'em_viagem').length,
      label: 'Em Viagem',
      icon: <FiNavigation />,
      color: 'green',
      change: '+1'
    },
    {
      value: vehicles.filter(v => v.alerts.length > 0).length,
      label: 'Com Alertas',
      icon: <FiAlertCircle />,
      color: 'orange',
      change: '0'
    },
    {
<<<<<<< HEAD
      value: `${((vehicles.filter(v => v.status === 'em_viagem').length / Math.max(vehicles.length, 1)) * 100).toFixed(0)}%`,
=======
      value: `${((vehicles.filter(v => v.status === 'em_viagem').length / vehicles.length) * 100).toFixed(0)}%`,
>>>>>>> 9d410153e6b110099f48b9ce892147f5ef75f43f
      label: 'Taxa de Utilização',
      icon: <IoStatsChart />,
      color: 'purple',
      change: '+5%'
    }
  ];

  const getTimeAgo = (date) => {
    const diff = Math.floor((new Date() - date) / 1000);
    if (diff < 60) return 'Agora mesmo';
    if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`;
    return `${Math.floor(diff / 3600)} h atrás`;
  };

<<<<<<< HEAD
  // Variantes de animação
=======
  const handleContactDriver = (vehicle) => {
    // Simulação de contato
    alert(`Contatando motorista ${vehicle.motorista} (${vehicle.placa})`);
  };

  const handleViewRoute = (vehicle) => {
    // Simulação de visualização de rota
    alert(`Mostrando rota para ${vehicle.destino}`);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
    setLastUpdate(new Date());
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

>>>>>>> 9d410153e6b110099f48b9ce892147f5ef75f43f
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const vehicleCardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.4
      }
    }),
    hover: {
      y: -4,
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  };

<<<<<<< HEAD
  // Configurações do Google Maps
  const renderMap = (status) => (
    <MapRenderer status={status} />
  );

=======
>>>>>>> 9d410153e6b110099f48b9ce892147f5ef75f43f
  if (isLoading) {
    return (
      <div className="monitoramento-loading-container">
        <div className="monitoramento-loading-content">
          <motion.div
            className="monitoramento-loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <FiNavigation className="monitoramento-spinner-icon" />
          </motion.div>
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Carregando Monitoramento
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Conectando com a frota em tempo real...
          </motion.p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="monitoramento-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div className="monitoramento-header" variants={itemVariants}>
        <div className="monitoramento-header-content">
          <div className="monitoramento-header-text">
            <span className="monitoramento-welcome-badge">
              <FiNavigation />
              Monitoramento em Tempo Real
            </span>
            <h1>Controle da Frota</h1>
            <p className="monitoramento-header-subtitle">
              Acompanhe toda sua frota com atualizações em tempo real
            </p>
            <div className="monitoramento-last-update">
              <FiClock />
              Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
              <span className={`auto-refresh-status ${autoRefresh ? 'active' : 'paused'}`}>
                {autoRefresh ? 'Atualização automática' : 'Atualização pausada'}
              </span>
            </div>
          </div>
          
          <div className="monitoramento-header-stats">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`monitoramento-stat-card monitoramento-stat-${stat.color}`}
                variants={itemVariants}
                whileHover={{ y: -2 }}
              >
                <div className="monitoramento-stat-background-pattern"></div>
                <div className="monitoramento-stat-content">
                  <div className="monitoramento-stat-main">
                    <div className="monitoramento-stat-icon-wrapper">
                      {stat.icon}
                    </div>
                    <div className="monitoramento-stat-values">
                      <h3>{stat.value}</h3>
                      <div className="monitoramento-stat-label">{stat.label}</div>
                      <div className={`monitoramento-stat-trend ${stat.change.includes('+') ? 'up' : 'neutral'}`}>
                        <span className="monitoramento-trend-icon">
                          {stat.change.includes('+') ? '↗' : '→'}
                        </span>
                        {stat.change}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="monitoramento-header-actions">
          <motion.button 
            className={`monitoramento-btn-outline ${autoRefresh ? 'active' : ''}`}
            onClick={toggleAutoRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {autoRefresh ? <FiPause /> : <FiPlay />}
            {autoRefresh ? 'Pausar' : 'Retomar'} Auto
          </motion.button>
          <motion.button 
            className="monitoramento-btn-primary"
            onClick={handleRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiRefreshCw className="monitoramento-btn-icon" />
            Atualizar Agora
          </motion.button>
          <motion.button 
            className="monitoramento-btn-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiBarChart2 className="monitoramento-btn-icon" />
            Relatórios
          </motion.button>
<<<<<<< HEAD
=======
          <motion.button 
            className="monitoramento-btn-outline"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiSmartphone className="monitoramento-btn-icon" />
            App Mobile
          </motion.button>
>>>>>>> 9d410153e6b110099f48b9ce892147f5ef75f43f
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="monitoramento-content">
        {/* Vehicles Sidebar */}
        <motion.div className="monitoramento-sidebar" variants={itemVariants}>
          <div className="monitoramento-sidebar-header">
            <h3>Frota Ativa</h3>
            <div className="monitoramento-sidebar-controls">
              <span className="monitoramento-vehicles-count">
                {filteredVehicles.length} de {vehicles.length} veículos
              </span>
              <div className="monitoramento-filter-buttons">
                {filters.map(filter => (
                  <motion.button
                    key={filter.key}
                    className={`monitoramento-filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
                    onClick={() => setActiveFilter(filter.key)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="monitoramento-filter-icon">{filter.icon}</span>
                    {filter.label}
                    <span className="monitoramento-filter-count">{filter.count}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="monitoramento-vehicles-list">
            <AnimatePresence>
              {filteredVehicles.map((vehicle, index) => {
                const statusInfo = statusConfig[vehicle.status];
                return (
                  <motion.div
                    key={vehicle.id}
                    custom={index}
                    variants={vehicleCardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className={`monitoramento-vehicle-card ${selectedVehicle?.id === vehicle.id ? 'active' : ''}`}
<<<<<<< HEAD
                    onClick={() => handleVehicleSelect(vehicle)}
=======
                    onClick={() => setSelectedVehicle(vehicle)}
>>>>>>> 9d410153e6b110099f48b9ce892147f5ef75f43f
                  >
                    <div className="monitoramento-vehicle-header">
                      <div className="monitoramento-vehicle-info">
                        <div className="monitoramento-vehicle-main">
                          <span className="monitoramento-vehicle-placa">{vehicle.placa}</span>
                          <span className="monitoramento-vehicle-modelo">{vehicle.modelo}</span>
                        </div>
                        <div className="monitoramento-vehicle-secondary">
                          <span className="monitoramento-vehicle-driver">
                            <FiUser />
                            {vehicle.motorista}
                          </span>
                        </div>
                      </div>
                      <div 
                        className="monitoramento-status-indicator"
                        style={{ 
                          backgroundColor: statusInfo.bgColor,
                          borderColor: statusInfo.color,
                          color: statusInfo.color
                        }}
                      >
                        <span className="monitoramento-status-icon">{statusInfo.icon}</span>
                      </div>
                    </div>
                    
                    <div className="monitoramento-vehicle-details">
                      <div className="monitoramento-detail-row">
                        <span className="monitoramento-detail-label">
                          <MdLocationOn />
                          Destino:
                        </span>
                        <span className="monitoramento-detail-value">{vehicle.destino}</span>
                      </div>
                      <div className="monitoramento-detail-row">
                        <span className="monitoramento-detail-label">
                          <FiMap />
                          Localização:
                        </span>
                        <span className="monitoramento-detail-value truncate">{vehicle.localizacao}</span>
                      </div>
                      
<<<<<<< HEAD
=======
                      {/* Alerts */}
>>>>>>> 9d410153e6b110099f48b9ce892147f5ef75f43f
                      <AnimatePresence>
                        {vehicle.alerts.length > 0 && (
                          <motion.div 
                            className="monitoramento-alerts-container"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            {vehicle.alerts.map(alert => (
                              <div key={alert} className="monitoramento-alert-badge">
                                {alertConfig[alert]?.icon}
                                {alertConfig[alert]?.label}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="monitoramento-metrics-row">
                        <div className="monitoramento-metric">
                          <span className="monitoramento-metric-icon">
                            <MdSpeed />
                          </span>
                          <span>{vehicle.velocidade} km/h</span>
                        </div>
                        <div className="monitoramento-metric">
                          <span className="monitoramento-metric-icon">
                            <MdLocalGasStation />
                          </span>
                          <span>{vehicle.combustivel}%</span>
                        </div>
                        <div className="monitoramento-metric">
                          <span className="monitoramento-metric-icon">
                            <MdDirectionsCar />
                          </span>
                          <span>{(vehicle.odometro / 1000).toFixed(0)}K km</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="monitoramento-vehicle-footer">
                      <span className="monitoramento-update-time">
                        <FiClock />
                        {getTimeAgo(vehicle.ultimaAtualizacao)}
                      </span>
                      <div className="monitoramento-vehicle-actions">
                        <motion.button 
                          className="monitoramento-btn-icon-small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactDriver(vehicle);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiPhone />
                        </motion.button>
                        <motion.button 
                          className="monitoramento-btn-icon-small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewRoute(vehicle);
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FiMap />
                        </motion.button>
                      </div>
                    </div>

<<<<<<< HEAD
=======
                    {/* Progress Bar for traveling vehicles */}
>>>>>>> 9d410153e6b110099f48b9ce892147f5ef75f43f
                    {vehicle.status === 'em_viagem' && (
                      <div className="monitoramento-route-progress">
                        <div className="monitoramento-progress-bar">
                          <motion.div 
                            className="monitoramento-progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${vehicle.routeProgress}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            style={{ backgroundColor: statusInfo.color }}
                          />
                        </div>
                        <span className="monitoramento-progress-text">
                          {vehicle.routeProgress.toFixed(0)}% concluído
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Map Container */}
        <motion.div className="monitoramento-map-container" variants={itemVariants}>
          <div className="monitoramento-map-header">
<<<<<<< HEAD
            <h3>Visualização da Rota - Google Maps</h3>
=======
            <h3>Visualização da Rota</h3>
>>>>>>> 9d410153e6b110099f48b9ce892147f5ef75f43f
            <div className="monitoramento-map-controls">
              <motion.button 
                className={`monitoramento-map-btn ${mapView === 'satellite' ? 'active' : ''}`}
                onClick={() => setMapView('satellite')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdSatellite />
                Satélite
              </motion.button>
              <motion.button 
                className={`monitoramento-map-btn ${mapView === 'traffic' ? 'active' : ''}`}
                onClick={() => setMapView('traffic')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdTraffic />
                Tráfego
              </motion.button>
              <motion.button 
                className="monitoramento-map-btn"
<<<<<<< HEAD
                onClick={() => {
                  setMapCenter({ lat: -23.5505, lng: -46.6333 });
                  setMapZoom(10);
                }}
=======
>>>>>>> 9d410153e6b110099f48b9ce892147f5ef75f43f
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MdMyLocation />
<<<<<<< HEAD
                Centralizar
              </motion.button>
            </div>
          </div>
          
          <div className="monitoramento-map-placeholder">
            {API_CONFIG.GOOGLE_MAPS_API_KEY && API_CONFIG.GOOGLE_MAPS_API_KEY !== 'SUA_CHAVE_API_AQUI' ? (
              <Wrapper 
                apiKey={API_CONFIG.GOOGLE_MAPS_API_KEY} 
                render={renderMap}
                libraries={["places", "geometry"]}
              >
                <MapComponent
                  selectedVehicle={selectedVehicle}
                  vehicles={vehicles}
                  center={mapCenter}
                  zoom={mapZoom}
                  onMarkerClick={handleMapMarkerClick}
                />
              </Wrapper>
            ) : (
              <div className="map-error">
                <FiAlertCircle />
                <h3>Chave da API do Google Maps não configurada</h3>
                <p>Para usar o mapa, configure sua chave da API em:</p>
                <code style={{ 
                  background: 'var(--gray-100)', 
                  padding: 'var(--space-sm)', 
                  borderRadius: 'var(--border-radius)',
                  marginTop: 'var(--space-sm)',
                  display: 'block',
                  fontSize: '0.875rem'
                }}>
                  API_CONFIG.GOOGLE_MAPS_API_KEY
                </code>
                <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.875rem' }}>
                  Obtenha uma chave em: <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank" rel="noopener noreferrer">Google Cloud Console</a>
                </p>
              </div>
            )}
=======
                Minha Localização
              </motion.button>
            </div>
          </div>
          <div className="monitoramento-map-placeholder">
            <div className="monitoramento-map-content">
              <div className="monitoramento-map-visualization">
                {selectedVehicle ? (
                  <motion.div 
                    className="monitoramento-route-map"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="monitoramento-route-path">
                      <div className="monitoramento-route-start">
                        <span className="monitoramento-route-marker start">
                          <FiFlag />
                        </span>
                        <span>Origem - São Paulo</span>
                      </div>
                      <div className="monitoramento-route-line">
                        <motion.div 
                          className="monitoramento-route-progress-line"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2, delay: 0.5 }}
                        />
                      </div>
                      <div className="monitoramento-route-current">
                        <motion.span 
                          className="monitoramento-route-marker vehicle"
                          animate={{ 
                            y: [0, -10, 0],
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <FiTruck />
                        </motion.span>
                        <span>{selectedVehicle.localizacao}</span>
                      </div>
                      <div className="monitoramento-route-line">
                        <motion.div 
                          className="monitoramento-route-progress-line"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2, delay: 1 }}
                        />
                      </div>
                      <div className="monitoramento-route-end">
                        <span className="monitoramento-route-marker end">
                          <FiNavigation />
                        </span>
                        <span>Destino - {selectedVehicle.destino}</span>
                      </div>
                    </div>
                    <div className="monitoramento-vehicle-on-map">
                      <h4>{selectedVehicle.placa}</h4>
                      <p>
                        <MdLocationOn />
                        Posição atual: {selectedVehicle.localizacao}
                      </p>
                      <div className="monitoramento-map-stats">
                        <span>Velocidade: {selectedVehicle.velocidade} km/h</span>
                        <span>Combustível: {selectedVehicle.combustivel}%</span>
                        <span>Progresso: {selectedVehicle.routeProgress.toFixed(0)}%</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="monitoramento-no-vehicle-selected"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="monitoramento-map-icon">
                      <FiMap />
                    </div>
                    <h3>Mapa em Tempo Real</h3>
                    <p>Selecione um veículo para visualizar a rota e localização</p>
                  </motion.div>
                )}
              </div>
            </div>
>>>>>>> 9d410153e6b110099f48b9ce892147f5ef75f43f
          </div>
        </motion.div>

        {/* Details Sidebar */}
        <motion.div className="monitoramento-details-sidebar" variants={itemVariants}>
          <AnimatePresence>
            {selectedVehicle ? (
              <motion.div 
                className="monitoramento-vehicle-details-panel"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="monitoramento-panel-header">
                  <div className="monitoramento-vehicle-title">
                    <h3>{selectedVehicle.placa}</h3>
                    <span className="monitoramento-vehicle-model">{selectedVehicle.modelo}</span>
                  </div>
                  <div 
                    className="monitoramento-status-badge"
                    style={{ 
                      backgroundColor: statusConfig[selectedVehicle.status].bgColor,
                      borderColor: statusConfig[selectedVehicle.status].color,
                      color: statusConfig[selectedVehicle.status].color
                    }}
                  >
                    <span className="monitoramento-status-icon">
                      {statusConfig[selectedVehicle.status].icon}
                    </span>
                    {statusConfig[selectedVehicle.status].label}
                  </div>
                </div>
                
                <div className="monitoramento-driver-info">
                  <div className="monitoramento-driver-avatar">
                    {selectedVehicle.motorista.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="monitoramento-driver-details">
                    <span className="monitoramento-driver-name">{selectedVehicle.motorista}</span>
<<<<<<< HEAD
                    <span 
                      className="monitoramento-driver-contact"
                      onClick={() => handleContactDriver(selectedVehicle)}
                    >
=======
                    <span className="monitoramento-driver-contact">
>>>>>>> 9d410153e6b110099f48b9ce892147f5ef75f43f
                      <FiPhone />
                      Contatar Motorista
                    </span>
                  </div>
                </div>

                <div className="monitoramento-details-grid">
                  <div className="monitoramento-detail-card">
                    <div className="monitoramento-detail-header">
                      <span className="monitoramento-detail-icon">
                        <MdLocalGasStation />
                      </span>
                      <span className="monitoramento-detail-label">Combustível</span>
                    </div>
                    <div className="monitoramento-detail-content">
                      <span className="monitoramento-detail-value">{selectedVehicle.combustivel}%</span>
                      <div className="monitoramento-progress-bar">
                        <motion.div 
                          className="monitoramento-progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedVehicle.combustivel}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          style={{ 
                            backgroundColor: selectedVehicle.combustivel < 20 ? 'var(--error)' : 
                                         selectedVehicle.combustivel < 40 ? 'var(--warning)' : 'var(--success)'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="monitoramento-detail-card">
                    <div className="monitoramento-detail-header">
                      <span className="monitoramento-detail-icon">
                        <FiThermometer />
                      </span>
                      <span className="monitoramento-detail-label">Temperatura</span>
                    </div>
                    <div className="monitoramento-detail-content">
                      <span className="monitoramento-detail-value">{selectedVehicle.temperatura}°C</span>
                      <span className="monitoramento-detail-subtext">Carga: {selectedVehicle.carga}</span>
                    </div>
                  </div>
                  
                  <div className="monitoramento-detail-card">
                    <div className="monitoramento-detail-header">
                      <span className="monitoramento-detail-icon">
                        <IoSpeedometerOutline />
                      </span>
                      <span className="monitoramento-detail-label">Velocidade</span>
                    </div>
                    <div className="monitoramento-detail-content">
                      <span className="monitoramento-detail-value">{selectedVehicle.velocidade} km/h</span>
                      <span className="monitoramento-detail-subtext">
                        Eficiência: {selectedVehicle.efficiency} km/L
                      </span>
                    </div>
                  </div>
                  
                  <div className="monitoramento-detail-card">
                    <div className="monitoramento-detail-header">
                      <span className="monitoramento-detail-icon">
                        <MdDirectionsCar />
                      </span>
                      <span className="monitoramento-detail-label">Odômetro</span>
                    </div>
                    <div className="monitoramento-detail-content">
                      <span className="monitoramento-detail-value">
                        {selectedVehicle.odometro.toLocaleString('pt-BR')} km
                      </span>
                      <span className="monitoramento-detail-subtext">
                        Próxima manutenção: {selectedVehicle.nextMaintenance} km
                      </span>
                    </div>
                  </div>

                  <div className="monitoramento-detail-card">
                    <div className="monitoramento-detail-header">
                      <span className="monitoramento-detail-icon">
                        <IoTimeOutline />
                      </span>
                      <span className="monitoramento-detail-label">Tempo de Viagem</span>
                    </div>
                    <div className="monitoramento-detail-content">
                      <span className="monitoramento-detail-value">{selectedVehicle.tempo_viagem}h</span>
                      <span className="monitoramento-detail-subtext">
                        Progresso: {selectedVehicle.routeProgress.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="monitoramento-detail-card">
                    <div className="monitoramento-detail-header">
                      <span className="monitoramento-detail-icon">
                        <FiActivity />
                      </span>
                      <span className="monitoramento-detail-label">Carga</span>
                    </div>
                    <div className="monitoramento-detail-content">
                      <span className="monitoramento-detail-value">{selectedVehicle.peso} ton</span>
                      <span className="monitoramento-detail-subtext">{selectedVehicle.carga}</span>
                    </div>
                  </div>
                </div>
                
                <div className="monitoramento-vehicle-actions-panel">
                  <motion.button 
                    className="monitoramento-btn-primary"
                    onClick={() => handleContactDriver(selectedVehicle)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiPhone className="monitoramento-btn-icon" />
                    Contatar Motorista
                  </motion.button>
                  <motion.button 
                    className="monitoramento-btn-outline"
                    onClick={() => handleViewRoute(selectedVehicle)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiMap className="monitoramento-btn-icon" />
                    Detalhes da Rota
                  </motion.button>
                  <motion.button 
                    className="monitoramento-btn-outline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiBarChart2 className="monitoramento-btn-icon" />
                    Histórico
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="monitoramento-no-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="monitoramento-no-selection-icon">
                  <FiTruck />
                </div>
                <h4>Nenhum veículo selecionado</h4>
                <p>Selecione um veículo da lista para visualizar detalhes e localização</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Monitoramento;