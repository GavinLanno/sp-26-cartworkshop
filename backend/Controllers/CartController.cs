using AutoMapper;
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private const string CurrentUserId = "default-user";
    private readonly MarketplaceContext _context;
    private readonly IMapper _mapper;

    public CartController(MarketplaceContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    [ProducesResponseType(typeof(CartResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CartResponse>> GetCart()
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart is null)
        {
            return NotFound();
        }

        return Ok(_mapper.Map<CartResponse>(cart));
    }

    [HttpPost]
    [ProducesResponseType(typeof(CartItemResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CartItemResponse>> AddToCart([FromBody] AddToCartRequest request)
    {
        var product = await _context.Products.FindAsync(request.ProductId);
        if (product is null)
        {
            return NotFound();
        }

        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart is null)
        {
            cart = new Cart
            {
                UserId = CurrentUserId
            };
            _context.Carts.Add(cart);
        }

        var cartItem = cart.Items.FirstOrDefault(item => item.ProductId == request.ProductId);
        if (cartItem is null)
        {
            cartItem = new CartItem
            {
                ProductId = request.ProductId,
                Quantity = request.Quantity
            };
            cart.Items.Add(cartItem);
        }
        else
        {
            cartItem.Quantity += request.Quantity;
        }

        cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        cartItem.Product = product;
        var response = _mapper.Map<CartItemResponse>(cartItem);
        return CreatedAtAction(nameof(GetCart), response);
    }

    [HttpPut("{cartItemId}")]
    [ProducesResponseType(typeof(CartItemResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CartItemResponse>> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemRequest request)
    {
        var cartItem = await _context.CartItems
            .Include(item => item.Cart)
            .Include(item => item.Product)
            .FirstOrDefaultAsync(item => item.Id == cartItemId);

        if (cartItem is null)
        {
            return NotFound();
        }

        if (cartItem.Cart.UserId != CurrentUserId)
        {
            return NotFound();
        }

        cartItem.Quantity = request.Quantity;
        cartItem.Cart.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(_mapper.Map<CartItemResponse>(cartItem));
    }

    [HttpDelete("{cartItemId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteCartItem(int cartItemId)
    {
        var cartItem = await _context.CartItems
            .Include(item => item.Cart)
            .FirstOrDefaultAsync(item => item.Id == cartItemId);

        if (cartItem is null)
        {
            return NotFound();
        }

        if (cartItem.Cart.UserId != CurrentUserId)
        {
            return NotFound();
        }

        _context.CartItems.Remove(cartItem);
        cartItem.Cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("clear")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ClearCart()
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart is null)
        {
            return NotFound();
        }

        _context.CartItems.RemoveRange(cart.Items);
        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }

}
