import { sampleLocations } from '@xtreme/mock-data';
import {
  BackButton,
  ChevronDownIcon,
  NavBookingsIcon,
  NavConciergeIcon,
  NavHomeIcon,
  NavProfileIcon,
} from '@xtreme/ui';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Local committed assets matching Figma node 45:681
const logoHeader = require('../../assets/logo.png');

// Unique cities extracted from authoritative Senegal sample locations
const AVAILABLE_CITIES = ['Dakar', 'Saly Portudal', 'Somone', 'Saint-Louis', 'Cap Skirring'];

/**
 * CUS-DISC-04: Geography Selector Screen
 * Authoritative Figma Frame: 45:681 (CUS-DISC-04__Geography_Selector__Ready)
 */
export default function GeographySelectorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedCountry] = useState('Senegal');
  const [selectedCity, setSelectedCity] = useState('Dakar');
  const [selectedArea, setSelectedArea] = useState<string>('Select area');

  // Modal selector state
  const [pickerType, setPickerType] = useState<'city' | 'area' | null>(null);

  // Available areas for selected city
  const availableAreas = useMemo(() => {
    const locs = sampleLocations.filter((l) => l.city.toLowerCase() === selectedCity.toLowerCase());
    return locs.map((l) => {
      if (l.airportCode) {
        return `${l.region} (${l.airportCode} Airport)`;
      }
      return l.region;
    });
  }, [selectedCity]);

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    // Reset area to default for this city
    const locs = sampleLocations.filter((l) => l.city.toLowerCase() === city.toLowerCase());
    if (locs.length > 0) {
      const first = locs[0];
      setSelectedArea(
        first.airportCode ? `${first.region} (${first.airportCode} Airport)` : first.region,
      );
    } else {
      setSelectedArea('Select area');
    }
    setPickerType(null);
  };

  const handleSelectArea = (area: string) => {
    setSelectedArea(area);
    setPickerType(null);
  };

  const handleApplyLocation = () => {
    // Navigate back to Discovery Home or Services with selected geography context
    router.push({
      pathname: '/discover',
      params: {
        city: selectedCity,
        area: selectedArea !== 'Select area' ? selectedArea : undefined,
      },
    } as never);
  };

  const handleCancel = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/discover' as never);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header Row */}
        <View style={styles.headerRow}>
          <BackButton onPress={handleCancel} />
          <View style={styles.logoWrap}>
            <Image source={logoHeader} style={styles.brandLogo} resizeMode="contain" />
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Title Row */}
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>Geography Selector</Text>
        </View>

        {/* Form Fields Container */}
        <View style={styles.formContainer}>
          {/* Field 1: Country */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Country</Text>
            <View style={styles.fieldBox}>
              <Text style={styles.fieldValueText}>{selectedCountry}</Text>
              <View style={styles.indicatorSlot}>
                <ChevronDownIcon size={14} color="#5B616B" />
              </View>
            </View>
          </View>

          {/* Field 2: City */}
          <Pressable
            style={styles.fieldGroup}
            onPress={() => setPickerType('city')}
            accessibilityRole="button"
            accessibilityLabel="Select City"
          >
            <Text style={styles.fieldLabel}>City</Text>
            <View style={styles.fieldBox}>
              <Text style={styles.fieldValueText}>{selectedCity}</Text>
              <View style={styles.indicatorSlot}>
                <ChevronDownIcon size={14} color="#5B616B" />
              </View>
            </View>
          </Pressable>

          {/* Field 3: Destination / Area */}
          <Pressable
            style={styles.fieldGroup}
            onPress={() => setPickerType('area')}
            accessibilityRole="button"
            accessibilityLabel="Select Destination or Area"
          >
            <Text style={styles.fieldLabel}>Destination / Area</Text>
            <View style={styles.fieldBox}>
              <Text
                style={[
                  styles.fieldValueText,
                  selectedArea === 'Select area' && styles.placeholderText,
                ]}
              >
                {selectedArea}
              </Text>
              <View style={styles.indicatorSlot}>
                <ChevronDownIcon size={14} color="#5B616B" />
              </View>
            </View>
          </Pressable>

          {/* Helper Note */}
          <Text style={styles.helperNote}>Configured options only</Text>

          {/* Action Buttons */}
          <Pressable
            style={({ pressed }) => [styles.applyBtn, pressed && styles.applyBtnPressed]}
            onPress={handleApplyLocation}
            accessibilityRole="button"
            accessibilityLabel="Apply Location"
          >
            <Text style={styles.applyBtnText}>Apply Location</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.cancelBtn, pressed && styles.cancelBtnPressed]}
            onPress={handleCancel}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Picker Modal for City & Area */}
      <Modal
        visible={pickerType !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPickerType(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setPickerType(null)}>
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>
              {pickerType === 'city' ? 'Select City in Senegal' : `Select Area in ${selectedCity}`}
            </Text>
            <View style={styles.modalDivider} />

            <ScrollView style={styles.modalList} showsVerticalScrollIndicator={false}>
              {pickerType === 'city'
                ? AVAILABLE_CITIES.map((city) => (
                    <Pressable
                      key={city}
                      style={[styles.modalItem, selectedCity === city && styles.modalItemSelected]}
                      onPress={() => handleSelectCity(city)}
                    >
                      <Text
                        style={[
                          styles.modalItemText,
                          selectedCity === city && styles.modalItemTextSelected,
                        ]}
                      >
                        {city}
                      </Text>
                    </Pressable>
                  ))
                : availableAreas.map((area) => (
                    <Pressable
                      key={area}
                      style={[styles.modalItem, selectedArea === area && styles.modalItemSelected]}
                      onPress={() => handleSelectArea(area)}
                    >
                      <Text
                        style={[
                          styles.modalItemText,
                          selectedArea === area && styles.modalItemTextSelected,
                        ]}
                      >
                        {area}
                      </Text>
                    </Pressable>
                  ))}
            </ScrollView>

            <Pressable style={styles.modalCloseBtn} onPress={() => setPickerType(null)}>
              <Text style={styles.modalCloseText}>Done</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Customer Bottom Navigation Bar */}
      <View style={[styles.bottomNav, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={styles.bottomNavRow}>
          {/* Home Tab (Active) */}
          <Pressable
            style={styles.navItem}
            onPress={() => router.push('/discover' as never)}
            accessibilityRole="tab"
            accessibilityState={{ selected: true }}
          >
            <NavHomeIcon active={true} size={24} />
            <Text style={[styles.navText, { color: '#164D53', fontWeight: '600' }]}>Home</Text>
            <View style={styles.activeUnderline} />
          </Pressable>

          {/* Bookings Tab */}
          <Pressable
            style={styles.navItem}
            onPress={() => router.push('/bookings' as never)}
            accessibilityRole="tab"
            accessibilityState={{ selected: false }}
          >
            <NavBookingsIcon active={false} size={24} />
            <Text style={styles.navText}>Bookings</Text>
          </Pressable>

          {/* Concierge Tab */}
          <Pressable
            style={styles.navItem}
            onPress={() => router.push('/concierge' as never)}
            accessibilityRole="tab"
            accessibilityState={{ selected: false }}
          >
            <NavConciergeIcon active={false} size={24} />
            <Text style={styles.navText}>Concierge</Text>
          </Pressable>

          {/* Profile Tab */}
          <Pressable
            style={styles.navItem}
            onPress={() => router.push('/account/profile' as never)}
            accessibilityRole="tab"
            accessibilityState={{ selected: false }}
          >
            <NavProfileIcon active={false} size={24} />
            <Text style={styles.navText}>Profile</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAF8F4',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 45,
  },
  logoWrap: {
    width: 82,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandLogo: {
    width: 82,
    height: 35,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  divider: {
    height: 1,
    backgroundColor: '#DDD8CF',
    marginHorizontal: 20,
    marginTop: 4,
  },
  titleRow: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0B0C0E',
    lineHeight: 32,
  },
  formContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    letterSpacing: 0.1,
  },
  fieldBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD8CF',
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldValueText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#0B0C0E',
    flex: 1,
  },
  placeholderText: {
    color: '#5B616B',
  },
  indicatorSlot: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperNote: {
    fontSize: 12,
    fontWeight: '400',
    color: '#5B616B',
    letterSpacing: 0.1,
    lineHeight: 16,
    marginTop: -4,
  },
  applyBtn: {
    height: 48,
    backgroundColor: '#0B0C0E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  applyBtnPressed: {
    opacity: 0.88,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },
  cancelBtn: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A6A19A',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnPressed: {
    backgroundColor: '#F5F3EF',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0B0C0E',
    letterSpacing: 0.1,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxHeight: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D8D0C4',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B0C0E',
    marginBottom: 12,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#DDD8CF',
    marginBottom: 12,
  },
  modalList: {
    maxHeight: 220,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  modalItemSelected: {
    backgroundColor: '#F5EFE0',
  },
  modalItemText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#0B0C0E',
  },
  modalItemTextSelected: {
    fontWeight: '600',
    color: '#164D53',
  },
  modalCloseBtn: {
    marginTop: 14,
    height: 40,
    backgroundColor: '#0B0C0E',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  // Bottom Navigation
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#DDD8CF',
  },
  bottomNavRow: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#5B616B',
    marginTop: 3,
  },
  activeUnderline: {
    width: 20,
    height: 2,
    backgroundColor: '#C6A15B',
    borderRadius: 999,
    marginTop: 3,
  },
});
