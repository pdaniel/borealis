var pipeworks = require('pipeworks');

var StepRunner = module.exports = function(subject) {
  this.subject = subject;
  this.state = 'fresh'; // 'fresh', 'ready', 'done'
  this.pipeline = pipeworks();
};

StepRunner.prototype.run = function(cb) {
  if (this.state === 'fresh') {
    var self = this;

    this.subject.steps.forEach(function(step) {
      self.pipeline.fit(function(context, next) {
        self.subject[step].call(self.subject, function(err) {
          if (err) {
            cb(err);
          } else {
            next(context);
          }
        });
      });
    });

    this.state = 'ready'
  }

  if (cb) {
    this.pipeline.fit(function() { cb(); });
  }

  var self = this;
  this.pipeline.fit(function() {
    self.status = 'done';
  });

  this.pipeline.flow();
};
