import React from 'react';
import { Link } from 'react-router';
import { listByCourse } from '../../../../actions/Lection';
import TimeAgo from 'react-timeago';
import CustomScroll from 'react-custom-scroll';
import Avatar from '../../../../core/helpers/Avatar';
import User from '../../../../core/helpers/User';
import { germanDateFormater } from '../../../../core/helpers/Utils';
import { like, dislike, submessages } from '../../../../actions/Message';
import Channel from '../../../../core/helpers/Channel';

export default class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = { messages: [], lections: {} };
  }

  componentDidMount() {
    this.update();
  }

  update() {
    listByCourse({ courseId: this.props.courseId },
      (r) => {
        let lections = {};
        r.forEach((lection) => Object.assign(lections, { [lection.id]: lection }));
        this.setState({ lections});
      },
      (e) => console.error('Get lections', e)
    );

    // Close all websocket connection
    this.messanger && this.messanger.close();

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

    this.messanger.connect(() => {
      this.messanger.subscribe(`course_${this.props.courseId}`);
      this.messanger.getMessages(`course_${this.props.courseId}`, 0, 500);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.courseId !== prevProps.courseId) {
      this.update();
    }
  }

  componentWillUnmount() {
    this.messanger && this.messanger.close();
    this.messanger = null;
  }

  onLike(message, e) {
    e.preventDefault();

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

  onSubmessagesShow(message) {
    // Expand submessages section
    Object.assign(message, { showSubcomments: !message.showSubcomments });
    this.setState({ messages: this.state.messages });

    // If no submessages - no need to request them from server
    if (message.numOfSubcomment === 0) {
      return ;
    }

    // Get submessages list
    submessages({ messageId: message.id },
      (submessages) => {
        // Extract submessage lection IDs
        submessages.map((submessage) => {
          Object.assign(submessage, { lectionId: submessage.toUserId.substr(8) });
        });
        
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

  addMessage() {
    this.messanger.sendMessage({
      text     : this.refs.message.value,
      title    : `${User.fullName} posted:`,
      toUserId: 'MAIN_STREAM',
      avatar   : User.avatar
    });
    this.refs.message.value = '';
  }

  handleKeyDown(e) {
    (e.which === 13) && this.addMessage();
  }

  renderMessage(message) {
    return (
      <div class={"clear".concat(message.parentMessageId ? " right" : "")}>
        <div class="avatar left">
          { <img src={message.avatar ? Avatar.toLink(message.avatar) : require("../../../../staticFiles/img/avatars/default.png")} width="45" alt="" /> }
        </div>
        <div class="message left">
          <div class="title text-bold">
            { message.title }
          </div>
          <div className="descr">
            { message.text }
            <br />
            { this.state.lections[message.lectionId] ?
              <Link className="to-lection" to={`/lection/${message.lectionId}`}>{this.state.lections[message.lectionId].title}</Link> :
              <Link className="to-lection" to={`/lection/${message.lectionId}`}>Go to lection</Link> }
          </div>
          <div class="woting clear">
            <div class="time fa fa-clock-o">
              <TimeAgo
                date={message.dateCreated}
                minPeriod={30}
                component="span"
                formatter={germanDateFormater}
              />
            </div>
            <div style={{cursor: 'pointer'}} class="hearts fa fa-heart right" onClick={this.onLike.bind(this, message)}>
              <span>{ message.likeCount }</span>
            </div>
            { !message.parentMessageId &&
              <div style={{cursor: 'pointer'}} class="comments fa fa-commenting right" onClick={this.onSubmessagesShow.bind(this, message)}>
                <span>{message.numOfSubcomment}</span>
              </div> }
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div class="column left">
        <div class="title border-color6 text-bold">
          Community Stream:
        </div>
        <CustomScroll allowOuterScroll={true} heightRelativeToParent="calc(700px)">
          <ul class="list">
            {
              this.state.messages.map((message, key) => (
                <li key={message.id + key}>
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
                    </div>
                  }
                </li>
              ))
            }
          </ul>
        </CustomScroll>
      </div>
    );
  }
}
