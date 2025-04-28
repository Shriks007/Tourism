import json
import os
import logging
from flask import render_template, request, jsonify, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user
from models import db, User

def load_json_data(filename):
    try:
        with open(os.path.join('static', 'data', filename), 'r') as file:
            return json.load(file)
    except Exception as e:
        logging.error(f"Error loading JSON data from {filename}: {str(e)}")
        return []

def register_routes(app):
    
    @app.route('/')
    def index():
        destinations = load_json_data('destinations.json')
        featured_destinations = destinations[:6]  # Get first 6 for featured section
        tours = load_json_data('tours.json')
        featured_tours = tours[:3]  # Get first 3 for featured section
        return render_template('index.html', 
                              featured_destinations=featured_destinations,
                              featured_tours=featured_tours)
    
    @app.route('/destinations')
    def destinations():
        destinations = load_json_data('destinations.json')
        region_filter = request.args.get('region', '')
        if region_filter:
            destinations = [d for d in destinations if d.get('region') == region_filter]
        
        # Get unique regions for filter
        regions = list(set(d.get('region', '') for d in load_json_data('destinations.json')))
        return render_template('destinations.html', destinations=destinations, regions=regions, selected_region=region_filter)
    
    @app.route('/destinations/<destination_id>')
    def destination_detail(destination_id):
        destinations = load_json_data('destinations.json')
        destination = next((d for d in destinations if str(d.get('id')) == destination_id), None)
        if not destination:
            flash('Destination not found', 'danger')
            return redirect(url_for('destinations'))
        
        # Find tours that include this destination
        tours = load_json_data('tours.json')
        related_tours = [t for t in tours if destination_id in [str(d) for d in t.get('destinations', [])]]
        
        return render_template('destination-detail.html', destination=destination, related_tours=related_tours)
    
    @app.route('/tours')
    def tours():
        tours = load_json_data('tours.json')
        duration_filter = request.args.get('duration', '')
        if duration_filter:
            if duration_filter == 'short':
                tours = [t for t in tours if t.get('duration', 0) <= 3]
            elif duration_filter == 'medium':
                tours = [t for t in tours if 3 < t.get('duration', 0) <= 7]
            elif duration_filter == 'long':
                tours = [t for t in tours if t.get('duration', 0) > 7]
        
        return render_template('tours.html', tours=tours, selected_duration=duration_filter)
    
    @app.route('/tours/<tour_id>')
    def tour_detail(tour_id):
        tours = load_json_data('tours.json')
        tour = next((t for t in tours if str(t.get('id')) == tour_id), None)
        if not tour:
            flash('Tour not found', 'danger')
            return redirect(url_for('tours'))
        
        # Get detailed information about the destinations included in this tour
        destinations = load_json_data('destinations.json')
        tour_destinations = []
        for dest_id in tour.get('destinations', []):
            dest = next((d for d in destinations if d.get('id') == dest_id), None)
            if dest:
                tour_destinations.append(dest)
        
        return render_template('tour-detail.html', tour=tour, tour_destinations=tour_destinations)
    
    @app.route('/contact', methods=['GET', 'POST'])
    def contact():
        if request.method == 'POST':
            # In a real application, you would handle form submission here
            # For now, we'll just flash a success message
            flash('Thank you for your inquiry! We will get back to you soon.', 'success')
            return redirect(url_for('contact'))
        return render_template('contact.html')
    
    @app.route('/login', methods=['GET', 'POST'])
    def login():
        if request.method == 'POST':
            user = User.query.filter_by(username=request.form.get('username')).first()
            if user and user.check_password(request.form.get('password')):
                login_user(user)
                flash('Logged in successfully.', 'success')
                return redirect(url_for('index'))
            flash('Invalid username or password.', 'danger')
        return render_template('login.html')

    @app.route('/signup', methods=['GET', 'POST'])
    def signup():
        if request.method == 'POST':
            if User.query.filter_by(username=request.form.get('username')).first():
                flash('Username already exists.', 'danger')
                return redirect(url_for('signup'))
            if User.query.filter_by(email=request.form.get('email')).first():
                flash('Email already registered.', 'danger')
                return redirect(url_for('signup'))
            
            user = User(
                username=request.form.get('username'),
                email=request.form.get('email')
            )
            user.set_password(request.form.get('password'))
            db.session.add(user)
            db.session.commit()
            
            login_user(user)
            flash('Account created successfully!', 'success')
            return redirect(url_for('index'))
        return render_template('signup.html')

    @app.route('/logout')
    @login_required
    def logout():
        logout_user()
        return redirect(url_for('index'))

    @app.route('/about')
    def about():
        return render_template('about.html')
    
    @app.route('/newsletter-signup', methods=['POST'])
    def newsletter_signup():
        email = request.form.get('email')
        if email:
            # In a real application, you would store this email in a database
            # For now, we'll just return a success message
            return jsonify({'success': True, 'message': 'Thank you for signing up for our newsletter!'})
        return jsonify({'success': False, 'message': 'Email is required.'}), 400
    
    @app.route('/booking-inquiry', methods=['POST'])
    def booking_inquiry():
        # In a real application, you would validate and store this inquiry in a database
        # For now, we'll just return a success message
        return jsonify({
            'success': True, 
            'message': 'Thank you for your booking inquiry! We will contact you shortly.'
        })
