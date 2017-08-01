import React from 'react';
import FileUpload from 'react-fileupload';
import { Loader } from 'react-loaders';
import '../../../node_modules/loaders.css/loaders.min.css';

export default class ProfileImageLoader extends React.Component {

    constructor() {
        super();

        this.state = {fileUploaded: false, link: '', isLoad: false};
    }

    componentWillMount() {
        if (this.props.avatar) {
            this.setState({
                link: this._createLink(this.props.avatar),
                fileUploaded: true
            });
        }
    }

    _createLink(avatar) {
        return `${config.BACK_URL}/file/content?name=${avatar}&path=/avatars`;
    }

    chooseAndUpload(e) {
        this.refs.fileUpload.forwardChoose();
    }

    get OPTIONS() {
        return {
            chooseAndUpload: true,
            fileFieldName: 'uploadFile',
            baseUrl: `${config.BACK_URL}/file/uploadAvatar`,
            beforeUpload: () => {
                this.setState({
                    isLoad: true
                });
            },
            uploadSuccess: (resp) => {

                this.setState({
                    isLoad: false,
                    fileUploaded: true,
                    link: this._createLink(resp.name)
                });

                this.props.uploadSuccess && this.props.uploadSuccess({
                    name: resp.name
                });

            }
        };
    }

    render() {

        let img;
        if (!this.state.isLoad) {
            img = (this.state.fileUploaded ?
                <img src={this.state.link} alt=""/> :
                <img src={require('../../staticFiles/img/camera.png')} alt=""/>
            )
        }

        return (
            <div className="left camera">
                <FileUpload ref="fileUpload" options={this.OPTIONS}/>
                <a href="javascript:void(0)" onClick={this.chooseAndUpload.bind(this)}>
                    { img }
                </a>
                { this.state.isLoad && <Loader type="line-scale" active /> }
            </div>
        );
    }
}