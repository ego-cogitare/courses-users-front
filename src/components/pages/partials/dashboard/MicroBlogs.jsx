import React from 'react';
import { Link } from 'react-router';
import { listDashboard } from '../../../../actions/Keylearning';

export default class MicroBlogs extends React.Component {

  constructor() {
    super();

    this.state = { keylearningsAndLections: [] };
  }

  componentWillMount() {
    this.update();
  }

  componentDidUpdate(prevProps) {
    if (this.props.courseId != prevProps.courseId) {
      this.update();
    }
  }

  update() {
    listDashboard(this.props.courseId,
      (r) => this.setState({ keylearningsAndLections: r }),
      (e) => console.error(e)
    );
  }

  render() {
    return (
      <div>
        <div class="title border-color4 text-bold">
          Deine neusten Micro-Blogs:
        </div>
        <div>
          <ul class="list">
            {
              this.state.keylearningsAndLections.map((item) => (
                <li key={item.keylearning.id}>
                  <div class="title text-bold">
                    <span class="color4">{item.lectionEntity.title}: </span>
                    {item.step.name}
                  </div>
                  <div class="descr">
                    {item.keylearning.text}
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
        <Link to="/microblogs" class="btn color4 border-color4" style={{ marginTop: '15px' }}>Bearbeiten</Link>
      </div>
    );
  }
}
