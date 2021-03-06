// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Will Farmer, Alec Martin, Emily Randall, Cris Salazar, Samuel Volin
 */
define( function( require ) {
  'use strict';

  // modules
  var AsymmetricPotential = require( 'QUANTUM_BOUND_STATES/quantum-bound-states/model/AsymmetricPotential' );
  var Coulomb1DPotential = require( 'QUANTUM_BOUND_STATES/quantum-bound-states/model/Coulomb1DPotential' );
  var Coulomb3DPotential = require( 'QUANTUM_BOUND_STATES/quantum-bound-states/model/Coulomb3DPotential' );
  var HarmonicOscillatorPotential = require( 'QUANTUM_BOUND_STATES/quantum-bound-states/model/HarmonicOscillatorPotential' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Particle = require( 'QUANTUM_BOUND_STATES/quantum-bound-states/model/Particle' );
  var PropertySet = require( 'AXON/PropertySet' );
  var QuantumBoundStatesConstants = require( 'QUANTUM_BOUND_STATES/quantum-bound-states/model/QuantumBoundStatesConstants' );
  var SquareWellPotential = require( 'QUANTUM_BOUND_STATES/quantum-bound-states/model/SquareWellPotential' );
  var SuperpositionCoefficients = require( 'QUANTUM_BOUND_STATES/quantum-bound-states/model/SuperpositionCoefficients' );
  
  // constants
  var MIN_X = -3.5; // nm
  var MAX_X = 3.5; // nm

  /**
   * Main constructor for QuantumBoundStatesModel, which contains all of the model logic for the entire sim screen.
   * @constructor
   */
  function QuantumBoundStatesModel() {

    var particle = new Particle();
    var squareWell = new SquareWellPotential( MIN_X, MAX_X, particle, 0.0, 1.0, 10.0 );
    var asymWell = new AsymmetricPotential( MIN_X, MAX_X, particle, 0.0, 1.0, 10.0 );
    var coulomb1D = new Coulomb1DPotential( MIN_X, MAX_X, particle, 0.0 );
    var coulomb3D = new Coulomb3DPotential( MIN_X, MAX_X, particle, 0.0 );
    var oscillatorWell = new HarmonicOscillatorPotential( MIN_X, MAX_X, particle, 0.0, 1.0 );
    this.potentials = [squareWell, asymWell, coulomb1D, coulomb3D, oscillatorWell];
    var coefficients = new SuperpositionCoefficients( squareWell );
    
    this.minX = MIN_X;
    this.maxX = MAX_X;
    
    PropertySet.call( this, {
      particle: particle,
      particleMass: QuantumBoundStatesConstants.ELECTRON_MASS,
      hoveredEigenstate: -1,
      currentPotential: squareWell,
      eigenvals: squareWell.getEigenvalues(),
      superpositionCoefficients: coefficients,
      
      showMagnifyingGlass: false,
      showProbDensity: true,
      showReal: true,
      showImaginary: false,
      showMagnitude: false,
      showPhase: false
      } );
    
    var thisNode = this;
    this.currentPotentialProperty.link( function() {
      thisNode.eigenvalsProperty.value = thisNode.currentPotentialProperty.value.getEigenvalues();
    });
  }

  return inherit( PropertySet, QuantumBoundStatesModel, {

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      // Handle model animation here.
    },
    
    /**
     * Return the minimum energy to be displayed on the potential graph
     */
    getMinEnergy: function( ) {
      return this.currentPotentialProperty.value.minEnergy;
    },
    
    /**
     * Return the maximum energy to be displayed on the potential graph
     */
    getMaxEnergy: function( ) {
      return this.currentPotentialProperty.value.maxEnergy;
    },
    
    /**
     * Called when the user mouses over an eigenstate line
     * Should be set to -1 when no state is hovered
     */
    setHoveredEigenstate: function( n ) {
      this.hoveredEigenstateProperty.value = n;
    },
    
    /**
     * Return the number of possible eigenstates, given the current parameters
     */
    getNumberOfEigenstates: function( ) {
      return this.currentPotentialProperty.value.getNumberOfEigenstates();
    },
    
    /**
     * Get a list of the energies of the eigenstates for the current potential
     */
    getEigenvalues: function( ) {
      return this.currentPotentialProperty.value.getEigenvalues();
    },
    
    /**
     * Get two arrays containing the subscripts for the current superposition state
     *  and the coefficients of each eigenstate
     * Subscripts contains the integers that describe each eigenstate
     * Coefficients contains floats between 0 and 1
     */
    getSubscriptsAndCoefficients: function( ) {
      var coeff = this.superpositionCoefficientsProperty.value;
      var nonzero = [];
      var subscripts = [];
      for (var i = 0; i < coeff.coefficients.length; i++ ) {
        if ( coeff.coefficients[i] !== 0 ) {
          nonzero.push(coeff.coefficients[i]);
          subscripts.push(i + this.currentPotentialProperty.value.groundState);
        }
      }
      return [subscripts, nonzero];
    },
    
    /**
     * Return the property that governs the mass of the particle
     */
    getParticleMassProperty: function( ) {
      return this.particleProperty.value.particleMassProperty;
    },
    
    /**
     * Returns the property that determines if the superposition coefficients are normalized
     */
    getNormalizedProperty: function( ) {
      return this.superpositionCoefficientsProperty.value.normalizedProperty;
    },
    
    /**
     * Set a single coefficient of a superposition state
     * Called when the user inputs a number into the superposition dialogue box
     */
    setCoefficient: function( i, value ) {
      this.superpositionCoefficientsProperty.value.setCoefficient( i, value );
    },
    
    /**
     * Set the selected eigenstate's coefficient to one
     * Set all the rest of the coefficients to zero
     * Called when the user clicks on an eigenstate
     */
    setOneCoefficient: function( i ) {
      this.superpositionCoefficientsProperty.value.setOneCoefficient( i );
    },
    
    /**
     * Normalize the superposition coefficients
     */
    normalize: function( ) {
      this.superpositionCoefficientsProperty.value.normalize();
    },
    
    /**
     * Returns true if more than one eigenstate is selected
     */
    isSuperpositionState: function( ) {
      return this.superpositionCoefficientsProperty.value.isSuperpositionState();
    },
    
    /**
     * Returns an array of x values and the corresponding y values of the superposition wavefunction at time t
     * t: time in fs (0 for the magnitude and the probability density)
     * isReal: real or imaginary part of the wavefunction (true for the magnitude and the probability density)
     */
    getWavefunctionPoints: function( t, isReal ) {
      var potential = this.currentPotentialProperty.value;
      var superposition = this.getSubscriptsAndCoefficients();
      var nodeArray = superposition[0];
      var coefficients = superposition[1];
      var psi = potential.getNthEigenstate( nodeArray[0] );
      var energy = potential.getNthEigenvalue( nodeArray[0] );
      
      // multiply by the propagator
      for (var l = 0; l < psi[1].length; l++) {
        if (isReal) {
          psi[1][l] *= Math.cos(-energy * t / QuantumBoundStatesConstants.HBAR);
        }
        else {
          psi[1][l] *= Math.sin(-energy * t / QuantumBoundStatesConstants.HBAR);
        }
      }
      // If there's only one selected eigenstate, return the wavefunction
      if (coefficients.length === 1) {
        return psi;
      }
      // Else, add up the superposition states
      for (var k = 0; k < psi[1].length; k++) {
        psi[1][k] *= coefficients[0];
      }
      var psiNew;
      for (var i = 1; i < coefficients.length; i++) {
        psiNew = potential.getNthEigenstate( nodeArray[0] - this.currentPotentialProperty.value.groundState )[1];
        energy = potential.getNthEigenvalue( nodeArray[0] - this.currentPotentialProperty.value.groundState );
        for (var j = 0; j < psi.length; j++) {
          if (isReal) {
            psi[1][j] += psiNew[j] * coefficients[j] * Math.cos(-energy * t / QuantumBoundStatesConstants.HBAR);
          }
          else {
            psi[1][j] += psiNew[j] * coefficients[j] * Math.sin(-energy * t / QuantumBoundStatesConstants.HBAR);
          }
        }
      }
      return psi;
    },
    
    /**
     * Get the probability density function
     */
    getProbabilityDensity: function( ) {
      var psi = this.getWavefunctionPoints( 0, true );
      for (var i = 0; i < psi[1].length; i++) {
        psi[1][i] = psi[1][i] * psi[1][i];
      }
      return psi;
    },
    
    /**
     * Get the real wave function at time t
     */
    getRealWave: function( t ) {
      return this.getWavefunctionPoints( t, true );
    },
    
    /**
     * Get the imaginary wave function at time t
     */
    getImaginaryWave: function( t ) {
      return this.getWavefunctionPoints( t, false );
    },
    
    /**
     * Get the magnitude of the wave function
     */
    getMagnitude: function( ) {
      var psi = this.getWavefunctionPoints( 0, true );
      for (var i = 0; i < psi[1].length; i++) {
        psi[1][i] = Math.abs(psi[1][i]);
      }
      return psi;
    }
  } );
} );