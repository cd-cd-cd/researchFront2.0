export default function useVarify () {
  // 验证电话号
  const checkPhone = (number: string) => {
    const reg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (!reg.test(number.trim())) {
      return false
    } else {
      return true
    }
  }

  // 检查邮箱
  const checkEmail = (data: string) => {
    const reg = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/
    if (!reg.test(data.trim())) {
      return false
    } else {
      return true
    }
  }

  // 检查个人简介
  const checkResume = (data: string) => {
    if (data.length > 200) {
      return false
    } else {
      return true
    }
  }

  return {
    checkPhone,
    checkEmail,
    checkResume
  }
}
