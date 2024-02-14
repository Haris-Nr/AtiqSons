import { Button, Modal } from 'antd';

const ConfirmationModal = ({ visible, onConfirm, onCancel, title, message}) => {
    return (
        <Modal
            title={title || 'Confirmation'}
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="confirm" type="primary" onClick={onConfirm}>
                    Confirm
                </Button>,
            ]}
        >
            {message}
        </Modal>
    );
};

export default ConfirmationModal;