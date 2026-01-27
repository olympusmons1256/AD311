def reverse_string(s: str) -> str:
    """Reverses a given string using recursion.

    Args:
        s (str): The string to be reversed.

    Returns:
        str: The reversed string.
    """
    if not isinstance(s, str):
        raise ValueError("Input must be a string.")
    # Base case: single character or empty string
    if len(s) <= 1:
        return s
    # Recursive case: reverse the substring and append the first character at the end
    return reverse_string(s[1:]) + s[0]
