def merge_customers(customerData1, m, customerData2, n):
    total = m + n
    if len(customerData1) < total:
        customerData1.extend([0] * (total - len(customerData1)))

    p1, p2, p = m -1, n-1, m + n -1

    while p1 >= 0 and p2 >= 0:
        if customerData1[p1] > customerData2[p2]:
            customerData1[p] = customerData1[p1]
            p1 -= 1
        else:
            customerData1[p] = customerData2[p2]
            p2 -= 1
        p -= 1

    while p2 >= 0:
        customerData1[p] = customerData2[p2]
        p2 -= 1
        p -= 1  
