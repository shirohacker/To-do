import {onUnmounted, ref} from "vue";

export const useToast = () => {
    const toastMessage = ref('')  // props를 이용해서 Toast 컴포넌트로 넘겨주기 위한 변수
    const toastAlertType = ref('')
    const showToast = ref(false)
    const timeout = ref(null)  // 내부적으로 사용하기 때문에 return 하지 않아도된다.
    const triggerToast = (message, type = 'success') => {  // toast를 실행시키는 함수
        toastMessage.value = message
        toastAlertType.value = type
        showToast.value = true
        timeout.value = setTimeout(() => {  // 3초후 Toast 사라지도록 만들기
            toastMessage.value = ''
            toastAlertType.value = ''
            showToast.value = false
        }, 3000)
    }

    onUnmounted(() => {
        clearTimeout(timeout.value) // setTimeout을 멈춤
    })

    return {
        toastMessage,
        toastAlertType,
        showToast,
        triggerToast,
    }
}
