export default class Avatar {

    static toLink(name) {
        return `${config.BACK_URL}/file/content?name=${name}&path=/avatars`;
    }

    static toLinkOrDefault(name) {
        return `${config.BACK_URL}/file/content?name=${name}&path=/avatars`;
    }

}
