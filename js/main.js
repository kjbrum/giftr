$(document).ready(function() {

	// Initialize Foundation JS
	$(document).foundation();

	var init = function() {
		Parse.initialize("iWHUm91rCzR2LTMzPptACdSLhtHZL4KJmvBwPY8N",
										 "1MMjDeyiHi3WLasr0S0Mo0KihKnFEtsIvoU1VMrX");
		// Check if the user is logged in
		if(Parse.User.current()) {
			getGifts();
		} else {
			loginSignUp();
		}
	}

	var loginSignUp = function() {
		$('#main-content').html('');
		this.template = Handlebars.compile($('#login-signup').html());
		$('#main-content').append(template());
	}

	var login = function() {
		this.username = $('#login-username').val();
		this.password = $('#login-password').val();

		Parse.User.logIn(this.username, this.password, {
			success: function() {
				console.log('User logged in!');
				init();
			},
			error: function(user, error) {
				console.log(user);
				console.log("Error: " + error.code + " " + error.message);
				$('.login-error').html(error.message).fadeIn().css('display', 'inline-block');
			}
		});
	}

	var logout = function() {
		Parse.User.logOut();
		init();
	}

	var signUp = function() {
		this.user = new Parse.User();
		this.username = $('#signup-username').val();
		this.password = $('#signup-password').val();
		this.email = $('#signup-email').val();

		user.signUp({
			'username': this.username,
			'password': this.password,
			'email': this.email
		}, {
			success: function() {
				console.log('User created!');
				getGifts();
			},
			error: function(user, error) {
				console.log("Error: " + error.code + " " + error.message);
				$('.signup-error').html(error.message).fadeIn().css('display', 'inline-block');
			}
		});
	}

	var saveGift = function() {
		this.user = Parse.User.current();
		this.Gift = Parse.Object.extend('Gift');
		this.gift = new Gift();


		gift.save({
		 'giftName': $('#gift-name').val(),
		 'giftPrice': $('#gift-price').val(),
		 'giftStore': $('#gift-store').val(),
		 'giftQuantity': $('#gift-quantity').val(),
		 'giftLink': $('#gift-link').val(),
		 'giftDescription': $('#gift-description').val(),
		 'user': this.user
		}, {
			success: function() {
				console.log('Gift saved!');
				$('#gift-name, #gift-price, #gift-store, #gift-quantity, #gift-link, #gift-description').val('');
				getGifts();
			},
			error: function(gift, error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	}

	var addGift = function(el) {
		$('#gift-form').html('');
		this.template = Handlebars.compile($('#add-gift').html());
		$('#gift-form').html(template());
	}

	var editGift = function(el) {
		this.Gift = Parse.Object.extend('Gift');
		this.query = new Parse.Query(Gift);
		this.id = $(el).attr('data-id');

		query.get(this.id, {
			success: function(gift) {
				var json = gift.toJSON();

				$('#gift-form').html('');
				this.template = Handlebars.compile($('#edit-gift').html());
				$('#gift-form').html(template(json));
			},
			error: function(gift, error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	}

	var deleteGift = function(el) {
		this.Gift = Parse.Object.extend('Gift');
		this.query = new Parse.Query(Gift);
		this.id = $(el).attr('data-id');

		query.get(this.id, {
			success: function(gift) {
				gift.destroy({
					success: function(gift) {
						console.log('Gift deleted!');
						getGifts();
					},
					error: function(gift, error) {
						console.log("Error: " + error.code + " " + error.message);
					}
				})
			},
			error: function(gift, error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	}

	var updateGift = function(el) {
		this.Gift = Parse.Object.extend('Gift');
		this.query = new Parse.Query(Gift);
		this.id = $(el).attr('data-id');

		query.get(this.id, {
			success: function(gift) {
				gift.save({
				 'giftName': $('#gift-name').val(),
				 'giftPrice': $('#gift-price').val(),
				 'giftStore': $('#gift-store').val(),
				 'giftQuantity': $('#gift-quantity').val(),
				 'giftLink': $('#gift-link').val(),
				 'giftDescription': $('#gift-description').val()
				}, {
					success: function(gift) {
						console.log('Gift updated!');
						init();
					},
					error: function(gift, error) {
						console.log("Error: " + error.code + " " + error.message);
					}
				})
			},
			error: function(gift, error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	}

	var getGifts = function() {
		this.user = Parse.User.current();
		this.Gift = Parse.Object.extend('Gift');
		this.query = new Parse.Query(Gift);
		query.descending('createdAt');
		query.limit(25);
		query.equalTo('user', user);

		query.find({
			success: function(results) {
				var user_info = user.toJSON();

				$('#main-content').html('');
				this.template = Handlebars.compile($('#gift-list').html());
				$('#main-content').html(template(user_info));

				this.template = Handlebars.compile($('#single-gift').html());

				$(results).each(function(i,el) {
					var json = el.toJSON();
					$('#gift-list').append(template(json));
				});

				if(results.length == 0) {
					$('#gift-list').append('<p><em>Looks like you haven\'t added any gifts yet.</em></p>');
				}

			},
			error: function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	}

	$('body').on('click', '#login-btn', function(e) {
		e.preventDefault();
		if($('#login-username').val() && $('#login-password').val()) {
			login();
		} else {
			$('.login-error').html('All the fields must be filled out').fadeIn().css('display', 'inline-block');
		}
	});

	$('body').on('click', '#signup-btn', function(e) {
		e.preventDefault();
		if($('#signup-username').val() && $('#signup-password').val() && $('#signup-email').val()) {
			signUp();
		} else {
			$('.signup-error').html('All the fields must be filled out').fadeIn().css('display', 'inline-block');
		}
	});

	$('body').on('click', '#add-gift-btn', function(e) {
		e.preventDefault();
		if($('#gift-name').val() && $('#gift-price').val() && $('#gift-store').val() && $('#gift-quantity').val()) {
			saveGift();
		} else {
			$('.error').html('Name, price, store, and quantity are required.').fadeIn().css('display', 'inline-block');
		}
	});

	$('body').on('click', '#update-gift-btn', function(e) {
		e.preventDefault();
		if($('#gift-name').val() && $('#gift-price').val() && $('#gift-store').val() && $('#gift-quantity').val()) {
			updateGift(this);
		} else {
			$('.error').html('Name, price, store, and quantity are required.').fadeIn().css('display', 'inline-block');
		}
	});

	$('body').on('click', '.single-gift a.delete-prompt-btn', function(e) {
		e.preventDefault();
		var id = $(this).attr('data-id');
		$(this).parent('.actions').html('<div class="delete-prompt">Are you sure you want to delete this gift? <a class="btn delete-gift-btn" href="#" data-id="'+id+'">Yes</a> | <a class="btn cancel-change" href="#">No</a></div>').hide().fadeIn();
	});

	$('body').on('click', 'a.add-new-gift-btn', function(e) {
		e.preventDefault();
		addGift();
		$('.gift-form-modal').trigger('click');
	});

	$('body').on('click', '.single-gift a.edit-gift-btn', function(e) {
		e.preventDefault();
		editGift(this);
		$('.gift-form-modal').trigger('click');
	});

	$('body').on('click', '.single-gift a.delete-gift-btn', function(e) {
		e.preventDefault();
		deleteGift(this);
	});

	$('body').on('click', '.cancel-change', function(e) {
		e.preventDefault();
		init();
	});

	$('body').on('click', '#logout', function(e) {
		e.preventDefault();
		logout();
	});

	init();

});
