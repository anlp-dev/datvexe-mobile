// import Toast from "react-native-simple-toast";
//
// export const showCustomToast = (message, type = "success") => {
//     let toastMessage;
//
//     switch (type) {
//         case "success":
//             toastMessage = `✔️ ${message}`; // Thêm icon dạng text
//             break;
//         case "error":
//             toastMessage = `❌ ${message}`;
//             break;
//         case "info":
//             toastMessage = `ℹ️ ${message}`;
//             break;
//         default:
//             toastMessage = message;
//     }
//
//     Toast.showWithGravity(toastMessage, Toast.LONG, Toast.TOP);
// };

import Toast from 'react-native-toast-message';

const getTitle = (type) => {
    if(type === 'success') {
        return '✔️ ';
    }else if(type === 'error') {
        return '❌ ';
    }else if(type === 'info') {
        return 'ℹ️ ';
    }else{
        return '';
    }
}

export const showCustomToast = (message, type = 'success', position = 'bottom') => {
    Toast.show({
        type: type,
        text1: getTitle(type) + message,
        position: position,
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 50,
    });
};

