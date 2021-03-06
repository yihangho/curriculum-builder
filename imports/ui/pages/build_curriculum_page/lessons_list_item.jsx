import React from 'react';

import { LessonForm } from '../../components/forms/lesson_form';

import { Curriculum } from '../../../api/curriculums';
import { Lesson } from '../../../api/lessons';

const LessonsListItem = React.createClass({
  propTypes: {
    curriculum: React.PropTypes.instanceOf(Curriculum).isRequired,
    lesson: React.PropTypes.instanceOf(Lesson).isRequired,
    sortable: React.PropTypes.bool
  },
  getDefaultProps() {
    return {
      sortable: true
    };
  },
  getInitialState() {
    return {
      edit: false
    };
  },
  renderGrabber() {
    if (this.props.sortable) {
      return <i className="grabber move icon" />;
    }
  },
  renderContent() {
    const containerStyle = {
      display: 'flex',
      alignItems: 'baseline'
    };

    const contentStyle = {
      flexGrow: 1
    };

    return (
      <div style={ containerStyle }>
        { this.renderGrabber() }

        <div style={ contentStyle }>
          <div className="header">
            <a href={ `/curriculums/${this.props.curriculum._id}/lessons/${this.props.lesson._id}` }>
              { this.props.lesson.title }
              { !this.props.lesson.is_active && " (Inactive)" }
            </a>
          </div>
        </div>

        <button className="ui icon button" onClick={ this.onEdit }>
          <i className="write icon" />
        </button>

        <button className="negative ui icon button" onClick={ this.onRemove }>
          <i className="trash icon" />
        </button>

      </div>
    );
  },
  renderForm() {
    return (
      <LessonForm curriculum={ this.props.curriculum }
                  lesson={ this.props.lesson }
                  didSave={ this.didSave }
                  onCancel={ this.hideEditForm }/>
    );
  },
  render() {
    return (
      <div className="ui segment" data-id={ this.props.lesson._id }>
        { this.state.edit ? this.renderForm() : this.renderContent() }
      </div>
    );
  },
  onEdit(event) {
    event.preventDefault();

    this.setState({
      edit: true
    });
  },
  didSave(promise) {
    promise.then(lesson => {
      if (lesson.type === this.props.lesson.type) {
        this.setState({
          edit: false
        });
      }
    }, error => {
      console.error(error);
    });
  },
  onRemove(event) {
    event.preventDefault();

    if (confirm(`Are you sure you want to remove ${this.props.lesson.title}?`)) {
      this.props.lesson.remove().then(lesson => this.props.curriculum.removeLesson(lesson));
    }
  },
  hideEditForm(event) {
    event.preventDefault();

    this.setState({
      edit: false
    });
  }
});

export { LessonsListItem };
