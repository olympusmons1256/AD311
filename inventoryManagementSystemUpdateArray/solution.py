def duplicate_zeros(inventory: list[int]) -> None:

    n = len(inventory)
    if n == 0: return

    # First pass: Find the number of zeros to duplicate
    possible_dups = 0
    last_valid_idx = n - 1
    
    i = 0
    while i <= last_valid_idx:
        if inventory[i] == 0:
            # Special case: Zero at the very end of the boundary
            if i == last_valid_idx:
                inventory[n - 1] = 0
                n -= 1 # Effective end shrinks
                break
            possible_dups += 1
            last_valid_idx -= 1
        i += 1

    # Second pass: Backward shift and duplicate zeros
    source = last_valid_idx
    dest = n - 1
    
    while source >= 0:
        if inventory[source] == 0:
            inventory[dest] = 0
            dest -= 1
            inventory[dest] = 0
        else:
            inventory[dest] = inventory[source]
        
        source -= 1
        dest -= 1