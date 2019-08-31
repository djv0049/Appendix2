var games = new Vue({ // eslint-disable-line no-unused-vars, no-undef
  el: '.games',
  data: {
    introMessage: 'Pick a game',
	tooltip:"cold: more than 40 away" + '\n' + "cool: between 20 and 40"
  },
  methods: {
    switchGame: function (num) {
      app1.show = false
      app2.show = false
      app3.show = false
      app4.show = false
      switch (num) {
        case 1:
          app1.show = true
		  this.introMessage = "I'm thinking of a number from 1-99 inclusive. Have a guess"
          break
        case 2:
          app2.show = true
          this.introMessage = "I'm thinking of a number from 1-99 inclusive, guess what it is."
		  break
        case 3:
          app3.show = true
		  this.introMessage = "Think of a number between 0 and 100, and I will try to guess it."
          break
        case 4:
          app4.show = true
		  this.introMessage = "Think of a number between 0 and 100, and I will try to guess it."
          break
      }
    }
  }
})

var app1 = new Vue({ // eslint-disable-line no-unused-vars, no-undef
  el: '#app1',
  data: {
    show: false,
    computerNum: parseInt(Math.floor(Math.random() * 100)),
    guess: '',
    trials: 0,
    message: 'Have a Guess',
    guessed: false
  },
  methods: {
    validate: function () {
      if (!this.guessed) {
        const guess = parseInt(this.guess)
        if (guess > this.computerNum) {
          this.message = 'Try Lower'
        } else if (guess < this.computerNum) {
          this.message = 'Try higher'
        } else if (guess === this.computerNum) {
          this.message = `You got it in ${this.trials} trials`
          this.guessed = true
          return
        }
        this.trials += 1
      }
    }
  }
})

var app2 = new Vue({ // eslint-disable-line no-unused-vars, no-undef
  el: '#app2',
  data: {
    show: false,
    computerNum: Math.floor(Math.random() * 100),
    guess: '',
    trials: 1,
    message: 'Have a Guess',
    guessed: false
  },
  methods: {
    validate: function () {
      if (!this.guessed) {
        let diff = this.guess - this.computerNum
        if (diff < 0) {
          diff = -diff
        }
        if (diff > 40) {
          this.message = 'Cold'
        } else if (diff > 20) {
          this.message = 'cool'
        } else if (diff > 10) {
          this.message = 'warm'
        } else if (diff > 0) {
          this.message = 'hot'
        } else if (diff === 0) {
          this.message = `got it in ${this.trials} trials`
        }
        this.trials += 1
      }
    }
  }
})


var app3 = new Vue({ // eslint-disable-line no-unused-vars, no-undef
  el: '#app3',
  data: {
    show: false,
    started: false,
    computerGuess: 0,
    max: 100,
    min: 0,
    guess: '',
    trials: 0,
    intro: 'think of a number between 0 and 100, can I guess what it is??',
    message: '',
    guessed: false
  },
  methods: {
    check: function (direction) {
      if (!this.guessed) {
        switch (direction) {
          case 1:
            this.min = this.computerGuess
            break
          case 0:
            this.guessed = true
            this.message = `I guessed it in ${this.trials} trials!\nTry again?`
            break
          case -1:
            this.max = this.computerGuess
            break
        }
        this.trials += 1
        if (this.min === this.max || this.min === 99 || this.max === 1 || this.min === this.max - 1) {
          this.message = ("You're lying")
          this.restart()
        }
        this.computerGuess = Math.floor((this.min + this.max) / 2)
      }
    },
    start: function () {
      this.started = true
      this.max = 100
      this.min = 0
      this.trials = 1
      this.message = this.intro
      this.computerGuess = (this.min + this.max) / 2
    },
    restart: function () {
      this.guessed = false
      this.started = false
    }
  }
})


var app4 = new Vue({ // eslint-disable-line no-unused-vars, no-undef
  el: '#app4',
  data: {
    show: false,
    started: false,
    computerGuess: 0,
    max: 100,
    min: 0,
    guess: '',
    trials: 0,
    intro: 'think of a number between 0 and 100, can I guess what it is??',
    message: '',
    guessed: false,
    previousAttempts: []
  },
  methods: {
    check: function (direction) {
      if (!this.guessed) {
        switch (direction) {
          case -2:
            this.setMinMax(100, 40)
            // do nothing because the computer is more than 40 away from your number

            // idea for PSP PIP //
            // ---------------- //
            // only pick numbers over 40 away.
            // if guess minus 40 is below 0, then set min as guess + 40
            // vice versa if the number + 40 is over 100
            break
          case -1:
            this.setMinMax(40, 20)
            // if the number minus 20 is 0 or less, set min as number + 20
            // again vice versa if number + 20 is over 100
            break
          case 0:
            this.guessed = true
            this.message = `I guessed it in ${this.trials} trials!\nTry again?`
            break
          case 1:
            this.setMinMax(20, 10)
            break
          case 2:
            this.setMinMax(10, 0)
            break
        }
        this.trials += 1
        if ((this.max - this.min) < 0 || this.min === 99 || this.max === 1 || this.min === this.max - 1) {
          this.message = "You're lying"
          this.restart()
        }
        this.previousAttempts.push(this.computerGuess)
        this.pickNew()
      }
    },
    setMinMax: function (num, num2) {
      if (this.min < this.computerGuess - num) {
        this.min = this.computerGuess - num
      } else if (this.computerGuess - num2 < this.min) {
        this.min = this.computerGuess + num2
      }
      if (this.max > this.computerGuess + num) {
        this.max = this.computerGuess + num
      } else if (this.computerGuess + num2 > this.max) {
        this.max = this.computerGuess - num2
      }
    }, // if all the numbers between min and max are in the previous attempts
    pickNew: function () {
      let count = 0
      for (let num = this.min; num <= this.max; num++) {
        if (!this.previousAttempts.includes(num)) {
          continue
        } else if (this.previousAttempts.includes(num)) {
          count += 1
        }
        if (count === this.max - this.min) {
          this.guessed = true
          this.message = "You're lying"
          this.restart()
        }
      }

      do {
        this.computerGuess = Math.floor(Math.random() * (this.max - this.min)) + this.min
      }
      while (this.previousAttempts.includes(this.computerGuess))
    },
    start: function () {
      this.started = true
      this.max = 100
      this.min = 0
      this.trials = 1
      this.message = this.intro
      this.computerGuess = (this.min + this.max) / 2
    },
    restart: function () {
      this.guessed = false
      this.started = false
      this.previousAttempts = []
    }
  }
})