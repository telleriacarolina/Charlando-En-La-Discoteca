import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';

interface Venue {
  id: string;
  name: string;
  type: string;
  distance?: number;
  activeUsers: number;
  isActive: boolean;
}

/**
 * VenueDiscoveryScreen - Location-based venue discovery
 * 
 * Features:
 * - Geolocation to find nearby venues
 * - Real-time active user counts
 * - Filter by venue type (nightclub, festival, convention)
 * - Distance-based sorting
 */
export default function VenueDiscoveryScreen({ navigation }: any) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(5); // km

  useEffect(() => {
    requestLocationAndFetchVenues();
  }, []);

  const requestLocationAndFetchVenues = async () => {
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission',
          'Location access is required to discover nearby venues.',
        );
        setLoading(false);
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setLocation(currentLocation);

      // Fetch nearby venues from API
      await fetchNearbyVenues(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        radius,
      );
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location. Please try again.');
      setLoading(false);
    }
  };

  const fetchNearbyVenues = async (
    lat: number,
    lng: number,
    radiusKm: number,
  ) => {
    try {
      const apiUrl = process.env.API_URL || 'http://localhost:3001';
      const token = 'YOUR_SESSION_TOKEN'; // Get from auth context
      
      const response = await fetch(
        `${apiUrl}/venues/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch venues');
      }

      const data = await response.json();
      setVenues(data);
    } catch (error) {
      console.error('Error fetching venues:', error);
      Alert.alert('Error', 'Failed to load nearby venues. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderVenueItem = ({ item }: { item: Venue }) => (
    <TouchableOpacity
      style={styles.venueCard}
      onPress={() => navigation.navigate('Chat', { venueId: item.id })}
    >
      <View style={styles.venueHeader}>
        <Text style={styles.venueName}>{item.name}</Text>
        <View style={[styles.badge, item.isActive && styles.activeBadge]}>
          <Text style={styles.badgeText}>
            {item.isActive ? 'LIVE' : 'CLOSED'}
          </Text>
        </View>
      </View>
      
      <View style={styles.venueInfo}>
        <Text style={styles.venueType}>{item.type.toUpperCase()}</Text>
        {item.distance && (
          <Text style={styles.venueDistance}>{item.distance.toFixed(1)} km away</Text>
        )}
      </View>
      
      <View style={styles.venueFooter}>
        <Text style={styles.activeUsers}>
          👥 {item.activeUsers} active {item.activeUsers === 1 ? 'user' : 'users'}
        </Text>
        <Text style={styles.joinText}>TAP TO JOIN →</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Finding nearby venues...</Text>
      </View>
    );
  }

  if (venues.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No Venues Found</Text>
        <Text style={styles.emptyText}>
          There are no active venues near your location.
        </Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={requestLocationAndFetchVenues}
        >
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nearby Venues</Text>
        <Text style={styles.headerSubtitle}>
          {venues.length} venue{venues.length !== 1 && 's'} within {radius} km
        </Text>
      </View>

      <FlatList
        data={venues}
        renderItem={renderVenueItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={requestLocationAndFetchVenues}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  list: {
    padding: 16,
  },
  venueCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  venueName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  activeBadge: {
    backgroundColor: '#10b981',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  venueInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  venueType: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
  venueDistance: {
    fontSize: 12,
    color: '#6b7280',
  },
  venueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  activeUsers: {
    fontSize: 14,
    color: '#374151',
  },
  joinText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
