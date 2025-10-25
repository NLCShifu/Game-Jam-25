import random
import string

def generate_unique_id():
    chars = string.ascii_uppercase + string.digits
    new_id = ''.join(random.choices(chars, k=6))
    return new_id
