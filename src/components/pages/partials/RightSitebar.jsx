import React from 'react';
import CustomScroll from 'react-custom-scroll';
import TimeAgo from 'react-timeago';
import User from '../../../core/helpers/User';
import { germanDateFormater } from '../../../core/helpers/Utils';
import Avatar from '../../../core/helpers/Avatar';
import Channel from '../../../core/helpers/Channel';
import { add, init, latest } from '../../../actions/Message';
import { like, dislike, remove, submessages } from '../../../actions/Message';
import '../../../staticFiles/css/custom-scrollbars.css';

export default class RightSitebar extends React.Component {

  constructor(props) {
    super(props);

    this.state = { rightSitebarShow: true, messages: [] };
    this.chatName = 'lection_' + props.lectionId;

    this.messanger = new Channel((newMessages) => {
      // If just one message added and parentMessageId not null - subcomment added
      if (newMessages.length === 1 && newMessages[0].parentMessageId) {
        this.state.messages = this.state.messages.map((message) => {
          if (message.id === newMessages[0].parentMessageId) {
            Object.assign(message, {
              submessages: (message.submessages || []).concat(newMessages),
              numOfSubcomment: ++message.numOfSubcomment
            });
          }
          return message;
        });
      }
      this.setState({ messages: newMessages.concat(this.state.messages) });
    });
  }

  componentDidMount() {
    this.messanger.connect(() => {
      this.messanger.subscribe(this.chatName);
      this.messanger.getMessages(this.chatName, 0, 500);
    });
  }

  componentWillUnmount() {
    this.messanger.close();
  }

  rightSitebarToggle(e) {
    this.setState({ rightSitebarShow: !this.state.rightSitebarShow });
  }

  onLike(message, e) {
    e.stopPropagation();

    like({ messageId: message.id },
      (r) => {
        message.likeCount++;
        this.setState({ messages: this.state.messages });
      },
      (e) => {
        // If 400-th http-error received: delete like
        if (e.status === 400) {
          dislike({ messageId: message.id },
            (r) => {
              message.likeCount--;
              this.setState({ messages: this.state.messages });
            },
            (e) => console.error(e)
          );
        }
      }
    );
  }

  handleKeyDown(e) {
    (e.which === 13) && this.addMessage(e);
  }

  addMessage(e) {
    e.preventDefault();
    e.stopPropagation();

    this.messanger.sendMessage({
      text     : this.refs.message.value,
      title    : `${User.fullName} posted:`,
      toUserId : this.chatName,
      courseId : localStorage.getItem('currentCourseId'),
      lectionId: this.props.lectionId,
      avatar   : User.avatar
    });

    // Dublicate to Community stream
    this.messanger.sendMessage({
      text     : this.refs.message.value,
      title    : `${User.fullName} posted:`,
      toUserId : 'course_' + localStorage.getItem('currentCourseId'),
      courseId : localStorage.getItem('currentCourseId'),
      lectionId: this.props.lectionId,
      avatar   : User.avatar
    });

    this.refs.message.value = '';
  }

  removeMessage({ id: messageId }) {
    remove({ messageId },
      (r) => {
        // Search and remove as parent message
        this.setState({
          messages: this.state.messages.filter((msg) => msg.id !== messageId)
        },
        () => {
          // Looking for submessages for parrent messages
          this.state.messages = this.state.messages.map((message) => {
            if (message.submessages) {
              Object.assign(message, {
                submessages: message.submessages.filter(({ id }) => id !== messageId),
                numOfSubcomment: --message.numOfSubcomment
              });
            }
            return message;
          });
          this.setState({ messages: this.state.messages });
        });
      },
      (e) => console.error(e)
    );
  }

  onSubMessageType(parrent, e) {
    (e.which === 13) && this.addSubMessage(parrent);
  }

  addSubMessage(parrent) {
    let message = {
      text            : this.refs[parrent.id].value,
      title           : `${User.fullName} commented:`,
      toUserId        : this.chatName,
      avatar          : User.avatar,
      parentMessageId : parrent.id
    };
    this.messanger.sendMessage(message);
    
    setTimeout(() => this.refs[parrent.id].value = '', 1);
  }

  onSubmessagesShow(message) {
    // Expand submessages section
    Object.assign(message, { showSubcomments: true });
    this.setState({ messages: this.state.messages });

    // If no submessages - no need to request them from server
    if (message.numOfSubcomment === 0) {
      return ;
    }

    // Get submessages list
    submessages({ messageId: message.id },
      (submessages) => {
        this.state.messages = this.state.messages.map((msg) => {
          if (msg.id === message.id) {
            return Object.assign(msg, { submessages });
          }
          return msg;
        });
        this.setState({ messages: this.state.messages });
      },
      (e) => console.error(e)
    );
  }

  renderMessage(message) {
    return (
      <div class={"message clear".concat(message.parentMessageId ? " right" : "")}>
        { (User.data.id === message.userId) && <i class="remove fa fa-remove" onClick={this.removeMessage.bind(this, message)} /> }
        <div class="avatar left">
          { <img src={message.avatar ? Avatar.toLink(message.avatar) : require("../../../staticFiles/img/avatars/default.png")} alt="" /> }
        </div>
        <div class="item-wrapper left">
          <div class="title-text">{message.title}</div>
          <div class="descr-text" dangerouslySetInnerHTML={{ __html: message.text }} />
          <div class="statistics clear">
            <div class="time fa fa-clock-o"><TimeAgo date={message.dateCreated} minPeriod={30} formatter={germanDateFormater} component="span"/></div>
            <div class="hearts fa fa-heart right" onClick={this.onLike.bind(this, message)}><span>{message.likeCount}</span></div>
            { !message.parentMessageId && <div class="comments fa fa-commenting right" onClick={this.onSubmessagesShow.bind(this, message)}><span>{message.numOfSubcomment}</span></div> }
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div class={"right-sitebar left".concat(this.state.rightSitebarShow ? "" : " minified")}>
        <CustomScroll heightRelativeToParent="calc(100%)">
          <div class="content-navigation">
            <ul>
              <li class="clear triangle">
                <i class="toggle" onClick={this.rightSitebarToggle.bind(this)}>{this.state.rightSitebarShow ? 'Verstecken' : 'Ausklappen'}</i>
                <textarea placeholder="Dein Posting..." class="community-editor" ref="message" onKeyDown={this.handleKeyDown.bind(this)} />
                <div class="toolbox clear">
                  <a href="#" class="send right" onClick={this.addMessage.bind(this)}>senden</a>
                </div>
              </li>
              {
                this.state.messages.map((message) => {
                  return message.parentMessageId ? null :
                    <li class="clear" key={message.id}>
                      { this.renderMessage(message) }
                      { /* If show subcomments flag is set */
                        message.showSubcomments &&
                        <div class="subcomments clear">
                          { /* If sumessages exists */
                            message.submessages &&
                            <ul class="messages">
                            {
                              message.submessages.map((submessage) => (
                                <li key={submessage.id}>
                                  { this.renderMessage(submessage) }
                                </li>
                              ))
                            }
                            </ul>
                          }
                          <textarea placeholder="Dein Posting..." class="community-editor right" ref={message.id} onKeyDown={this.onSubMessageType.bind(this, message)} />
                          <div class="toolbox clear right">
                            <span class="send right" onClick={this.addSubMessage.bind(this, message)}>senden</span>
                          </div>
                        </div>
                      }
                      <div class="clear separator" />
                    </li>;
                })
              }
            </ul>
          </div>
        </CustomScroll>
      </div>
    );
  }
};
