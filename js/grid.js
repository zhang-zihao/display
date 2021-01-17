class Grid {
	//converter -- grid index to world position(position is snapped to grid)
    GridToPosition (grid_x,grid_z)
    {
		var realpos = {};
		//Grid(0,0) is world pos (0.25,0.25). Each lattice is 0.5x0.5 size.
        realpos.x = 0.25+ (grid_x*0.5);
        realpos.y = 0;
		realpos.z = 0.25-(grid_z*0.5);
		
        return realpos;
	}
    //converter -- world position to grid index (position is rounded to grid)
	RealPosToGrid(realpos)
	{
		var gridpos = {};
		//Grid(0,0) is world pos (0.25,0.25). Each lattice is 0.5x0.5 size.
		gridpos.x = (realpos.x - 0.25)/0.5;
		gridpos.z = (realpos.y-0.25)/0.5;
		//balance off the grid image's perspective offset, 
		//reason: the grid on the plane texture isn't at the same perspective 
		//as the plane's real perspective in 3d view.
		if(realpos.y>0)
		{
			gridpos.x*= 1+(.15*realpos.y);
			gridpos.z*= 1+(.15*realpos.y);
		}
		if(realpos.y<0)
		{
			gridpos.x*= 1/(1-(.10*realpos.y));
			gridpos.z*= 1/(1-(.10*realpos.y));
		}
		//round the value to see which lattice it falls in
		gridpos.x = Math.round(gridpos.x);
		gridpos.z= Math.round(gridpos.z);
		//adjustment: the whole grid should be 1 lattice up on the z axis
		gridpos.z += 1;
		
		return gridpos;
	}
    
}