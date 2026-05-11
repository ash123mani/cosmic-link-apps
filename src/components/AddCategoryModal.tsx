import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { Colors } from '@/constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
}

export function AddCategoryModal({ visible, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || name.trim().length < 3) {
      Alert.alert('Error', 'Category name must be at least 3 characters');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(name.trim());
      setName('');
      onClose();
    } catch {
      Alert.alert('Error', 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Category</Text>
          <TextInput
            style={styles.input}
            placeholder="Category name"
            value={name}
            onChangeText={setName}
            autoFocus
            placeholderTextColor={Colors.gray}
          />
          <View style={styles.buttons}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
              {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.submitText}>Add</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: 4,
    padding: 24,
    width: '85%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.blackMedium,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.blackLight,
    borderRadius: 4,
    padding: 14,
    fontSize: 15,
    
    color: Colors.blackMedium,
    marginBottom: 20,
  },
  buttons: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 4,
    backgroundColor: Colors.bodyBg,
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.blackMedium,
    fontWeight: '600',
  },
  submitBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  submitText: {
    color: Colors.white,
    fontWeight: '600',
  },
});
