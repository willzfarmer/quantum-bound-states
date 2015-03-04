//  Copyright 2002-2014, University of Colorado Boulder

/**
 *
 * @author Will Farmer, Alec Martin, Emily Randall, Cris Salazar, Samuel Volin
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var QuantumBoundStatesConstants = require( 'QUANTUM_BOUND_STATES/quantum-bound-states/model/QuantumBoundStatesConstants' );
  var SquareWellPotential = require( 'QUANTUM_BOUND_STATES/quantum-bound-states/model/SquareWellPotential' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Main constructor for QuantumBoundStatesModel, which contains all of the model logic for the entire sim screen.
   * @constructor
   */
  function QuantumBoundStatesModel() {
    var constants = new QuantumBoundStatesConstants();
    this.minX = -3.5; // nm
    this.maxX = 3.5; // nm
    var firstPotential = new SquareWellPotential( 0.0, 1.0, 10.0 );

    PropertySet.call( this, {
      particleMass: 1*constants.electronMass,
      currentEigenstate: 1,
      currentEnergy: firstPotential.getNthEigenvalue( 1 ),
      currentPotential: firstPotential,
      eigenvals: firstPotential.getEigenvalues(),
      superpositionCoefficients: [1],
      
      showMagnifyingGlass: false,
      showProbDensity: true,
      showReal: true,
      showImaginary: false,
      showMagnitude: false,
      showPhase: false,
      } );
  }

  return inherit( PropertySet, QuantumBoundStatesModel, {

    // Called by the animation loop. Optional, so if your model has no animation, you can omit this.
    step: function( dt ) {
      // Handle model animation here.
    },
    
    /**
     * Change the current potential being displayed
     */
    setPotential: function( potential ) {
      this.currentEigenstateProperty.value +=  potential.groundState - this.currentPotentialProperty.value.groundState;
      this.currentPotentialProperty.value = potential;
      this.eigenvalsProperty.value = potential.getEigenvalues();
      this.currentEnergyProperty.value = potential.getNthEigenvalue( this.currentEigenstateProperty.value );
    },
    
    /**
     * Get a set of n points (x, y) to draw the potential well
     */
    getPotentialPoints: function( n ) {
      var points = [];
      var delta = (this.maxX - this.minX) / n;
      var x = this.minX;
      var potential = this.currentPotentialProperty.value;
      for (var i = 0; i < n; i++ ) {
        points.push( new Vector2( x, potential.potentialValue(x) ) );
        x += delta;
      }
      return points;
    }
  } );
} );