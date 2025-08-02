import React, {forwardRef, useCallback, useMemo} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import Button from '../Button';

interface CustomModalProps {
  title?: any;
  children?: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
  candidate?: string;
}

const ViewedRequests = forwardRef<BottomSheetModal, CustomModalProps>(
  ({title, children, onClose, onConfirm, candidate}, ref) => {
    const snapPoints = useMemo(() => ['25', '50%', '70%'], []);
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}>
            <Text style={styles.header}>Are you sure you want to cancel the request?</Text>
          </View>
          <View style={styles.buttons}>
            {onConfirm && (
              <Button
                title="Keep looking"
                onPress={onConfirm}
                style={styles.confirmBtn}
                textColor="white"
                textStyle={{fontWeight: 'normal'}}
              />
            )}
            {onClose && (
              <Button
                title="Close request"
                onPress={onClose}
                style={styles.cancelBtn}
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
  title: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  body: {marginBottom: 20},
  modalTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#25B324',
    textTransform: 'capitalize',
  },
  cancelBtn: {
    paddingVertical: 10,
    backgroundColor: '#E4E4E4',
    flex: 1,
  },
  confirmBtn: {
    paddingVertical: 10,
    backgroundColor: '#25B324',
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
    fontSize: 20,
    fontWeight:'bold',
    textAlign: 'center'
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
});

export default ViewedRequests;
