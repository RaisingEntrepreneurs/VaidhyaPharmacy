import React from 'react';
import { Grid, Link, Typography } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import './home.css';

// Import images for social media icons
import facebookpic from '../images/facebookpic.png';
import instagram from '../images/instagram.webp';
import Linkedin from '../images/Linkedin.png';
import twitter from '../images/twitter.webp';

function Footer() {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="App-footer" style={{ backgroundColor: '#797979', padding: '1%', textAlign: 'left', height: 'auto' }}>
      <Grid container spacing={0.5}>
        <Grid item xs={6} sm={1}>
          <nav>
            <Link
              underline="none"
              color="white"
              style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}
              onClick={() => scrollToSection('about-us-section')}
            >
              About Us
            </Link>
            <Link
              underline="none"
              color="white"
              style={{ fontSize: '0.7rem', display: 'block', marginBottom: '0.5rem' }}
              onClick={() => scrollToSection('contact-us-section')}
            >
              Contact Us
            </Link>
            <Link
              underline="none"
              color="white"
              style={{ fontSize: '0.7rem', display: 'block', marginBottom: '0.5rem' }}
              onClick={() => scrollToSection('news-section')}
            >
              News
            </Link>
            <Link
              underline="none"
              color="white"
              style={{ fontSize: '0.7rem', display: 'block', marginBottom: '0.5rem' }}
              onClick={() => scrollToSection('careers-section')}
            >
              Careers
            </Link>
          </nav>
        </Grid>
        <Grid item xs={6} sm={1}>
          <nav>
            <Link
              underline="none"
              color="white"
              style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}
              onClick={() => scrollToSection('legal-section')}
            >
              Legal
            </Link>
            <Link
              variant="h8"
              underline="none"
              color="white"
              style={{ fontSize: '0.7rem', display: 'block', marginBottom: '0.5rem' }}
              onClick={() => scrollToSection('privacy-section')}
            >
              Privacy Notice
            </Link>
            <Link
              underline="none"
              color="white"
              style={{ fontSize: '0.7rem', display: 'block', marginBottom: '0.5rem' }}
              onClick={() => scrollToSection('terms-section')}
            >
              Terms of Use
            </Link>
          </nav>
        </Grid>
        <Grid item xs={6} sm={1}>
          <nav>
            <Link
              underline="none"
              color="white"
              style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}
              onClick={() => scrollToSection('quick-links-section')}
            >
              Quick Links
            </Link>
            <Link
              underline="none"
              color="white"
              style={{ fontSize: '0.7rem', display: 'block', marginBottom: '0.5rem' }}
              onClick={() => scrollToSection('support-section')}
            >
              Support Center
            </Link>
            <Link
              underline="none"
              color="white"
              style={{ fontSize: '0.7rem', display: 'block', marginBottom: '0.5rem' }}
              onClick={() => scrollToSection('service-section')}
            >
              Service Center
            </Link>
            <Link
              underline="none"
              color="white"
              style={{ fontSize: '0.7rem', display: 'block', marginBottom: '0.5rem' }}
              onClick={() => scrollToSection('blogs-section')}
            >
              Blogs
            </Link>
            <Link
              underline="none"
              color="white"
              style={{ fontSize: '0.7rem', display: 'block', marginBottom: '0.5rem' }}
              onClick={() => scrollToSection('customers-section')}
            >
              Customers
            </Link>
          </nav>
        </Grid>
        <Grid item xs={6} sm={1}>
          <nav style={{ marginLeft: 'right' }}>
            <Link
              underline="none"
              color="white"
              style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}
              onClick={() => scrollToSection('social-media-section')}
            >
              Social Media
            </Link>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={facebookpic} alt="Facebook" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
              <img src={instagram} alt="Instagram" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
              <img src={Linkedin} alt="Facebook" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
              <img src={twitter} alt="Instagram" style={{ width: '20px', height: '20px', marginRight: '5px' }} />
            </div>
          </nav>
        </Grid>
      </Grid>
      {/* Sections with corresponding ids */}
      <section id="about-us-section">
        
      </section>
      <section id="contact-us-section">
        {/* Your Contact Us section */}
      </section>
      <section id="news-section">
        {/* Your News section */}
      </section>
      <section id="careers-section">
        {/* Your Careers section */}
      </section>
      <section id="legal-section">
        {/* Your Legal section */}
      </section>
      <section id="privacy-section">
        {/* Your Privacy section */}
      </section>
      <section id="terms-section">
        {/* Your Terms section */}
      </section>
      <section id="quick-links-section">
        {/* Your Quick Links section */}
      </section>
      <section id="support-section">
        {/* Your Support Center section */}
      </section>
      <section id="service-section">
        {/* Your Service Center section */}
      </section>
      <section id="blogs-section">
        {/* Your Blogs section */}
      </section>
      <section id="customers-section">
        {/* Your Customers section */}
      </section>
      <section id="social-media-section">
        {/* Your Social Media section */}
      </section>
      <Typography variant="body2" color="white" style={{ fontSize: '0.75rem', textAlign: 'center', justifyContent: 'center', alignItems: 'center', marginTop: '0%' }}>
        © 2023 Vaidhya Health Care. All rights reserved.
      </Typography>
    </footer>
  );
}

export default Footer;
