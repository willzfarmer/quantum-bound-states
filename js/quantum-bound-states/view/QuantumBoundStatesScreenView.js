// Copyright 2002-2015, University of Colorado Boulder

/**
 *
 * @author Will Farmer, Alec Martin, Emily Randall, Cris Salazar, Samuel Volin
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  //var EnergyLine = require( 'QUANTUM_BOUND_STATES/quantum-bound-states/view/EnergyLine' );
  var EnergyPlotNode = require( 'QUANTUM_BOUND_STATES/quantum-bound-states/view/EnergyPlotNode' );
  var WaveFunctionPlotNode = require( 'QUANTUM_BOUND_STATES/quantum-bound-states/view/WaveFunctionPlotNode' );
  var PotentialWellPanel = require( 'QUANTUM_BOUND_STATES/quantum-bound-states/view/PotentialWellPanel' );
  var WaveFunctionPlotControls = require( 'QUANTUM_BOUND_STATES/quantum-bound-states/view/WaveFunctionPlotControls' );
  var ParticleMassPanel = require( 'QUANTUM_BOUND_STATES/quantum-bound-states/view/ParticleMassPanel' );

  /**
   * @param {QuantumBoundStatesModel} quantumBoundStatesModel
   * @constructor
   */
  function QuantumBoundStatesScreenView( quantumBoundStatesModel ) {

    ScreenView.call( this );
    
    var particleMassProperty = quantumBoundStatesModel.getParticleMassProperty();
    
    var energyPlotNode = new EnergyPlotNode( quantumBoundStatesModel, 600, 250, {
      x: 0,
      y: 50,
    });
    this.addChild( energyPlotNode );

    /*var energyLine = new EnergyLine( quantumBoundStatesModel, 600, 250, {
      x: 50,
      y: 100,
    });
    this.addChild( energyLine );*/

    var waveFunctionPlotNode = new WaveFunctionPlotNode( quantumBoundStatesModel, 600, 200, {
      x: 0,
      y: energyPlotNode.bottom + 20,
    });
    this.addChild( waveFunctionPlotNode );

    var potentialWellPanel = new PotentialWellPanel( quantumBoundStatesModel ).mutate( {
      right: this.layoutBounds.maxX - 10,
      top: 10,
    });
    this.addChild( potentialWellPanel );
    
    var waveFunctionPlotControls = new WaveFunctionPlotControls( quantumBoundStatesModel ).mutate( {
      right: this.layoutBounds.maxX - 10,
      top: potentialWellPanel.bottom + 10
    } );
    this.addChild( waveFunctionPlotControls );

    var particleMassPanel = new ParticleMassPanel( particleMassProperty ).mutate( {
      right: this.layoutBounds.maxX - 10,
      top: waveFunctionPlotControls.bottom + 10,
    });
    this.addChild( particleMassPanel );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        quantumBoundStatesModel.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );
  }

  return inherit( ScreenView, QuantumBoundStatesScreenView, {

    // Called by the animation loop. Optional, so if your view has no animation, you can omit this.
    step: function( dt ) {
      // Handle view animation here.
    }
  } );
} );
