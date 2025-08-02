import React, {forwardRef, useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Button from '../Button';

const cancelReasons = [
  'I don’t need a ride anymore',
  'Wrong address',
  'Driver didn’t show up',
  'Driver was rude',
  'Driver ask to cancel',
  'Driver asks for extra fare',
  'Need changes in ride',
  'Complaint about the driver',
  'App issue',
  'Other reason',
];
interface CustomModalProps {
  title?: any;
  children?: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
  candidate?: string;
}

const CancelReasons = forwardRef<BottomSheetModal, CustomModalProps>(
  ({title, children, onClose, onConfirm, candidate}, ref) => {
    const snapPoints = useMemo(() => ['80%', '85%', '90%'], []);
    const [selectedReason, setSelectedReason] = useState('');
    const renderBackdrop = useCallback(
      props => (
        <BottomSheetBackdrop
          {...props}
          pressBehavior="close"
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      ),
      [],
    );
    return (
      <BottomSheetModal
        ref={ref}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}>
        <BottomSheetView style={styles.contentContainer}>
          <View style={{width: '100%'}}>
            <View style={styles.header}>
              <Text style={styles.title}>Why do you want to cancel?</Text>
              <TouchableOpacity onPress={onClose}>
                <Icon name="navigation" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={cancelReasons}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => setSelectedReason(item)}
                  style={[
                    styles.option,
                    selectedReason === item && styles.selectedOption,
                  ]}>
                  <Text
                    style={[
                      styles.optionText,
                      selectedReason === item && styles.selectedText,
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>

          <View style={styles.buttons}>
            {onClose && (
              <Button
                title="Close"
                onPress={onClose}
                style={styles.cancelBtn}
                textColor="#FF0000"
                textStyle={{fontWeight: 'normal'}}
              />
            )}
            {onConfirm && (
              <Button
                title="submit"
                onPress={() => onConfirm?.(selectedReason)}
                style={styles.confirmBtn}
                textColor="#FF0000"
                textStyle={{fontWeight: 'normal'}}
              />
            )}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    gap: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  body: {marginBottom: 20},
  modalTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#25B324',
    textTransform: 'capitalize',
  },
  cancelBtn: {
    paddingVertical: 10,
    backgroundColor: '#25B324',
    flex: 1,
  },
  confirmBtn: {
    paddingVertical: 10,
    backgroundColor: '#E4E4E4',
    flex: 1,
  },
  buttons: {
    gap: 10,
    width: '100%',
    marginTop: 15,
  },
  header: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    textAlign: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
  },
  images: {
    flexDirection: 'row',
  },
  avatarOverlap: {
    marginLeft: -25,
  },
  option: {
    padding: 12,
    width: '100%',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
  selectedOption: {
    backgroundColor: '#25B324',
    borderRadius: 8,
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CancelReasons;
